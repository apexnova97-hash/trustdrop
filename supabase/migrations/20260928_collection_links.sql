-- TrustDrop account/business consistency fix

create or replace function public.trustdrop_make_slug(source_name text)
returns text
language plpgsql
as $$
declare
  result text;
begin
  result := regexp_replace(
    lower(coalesce(nullif(trim(source_name), ''), 'business')),
    '[^a-z0-9]+',
    '-',
    'g'
  );
  result := trim(both '-' from result);

  if result = '' then
    result := 'business';
  end if;

  return result;
end;
$$;

create or replace function public.handle_new_trustdrop_business()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  final_slug text;
  suffix integer := 1;
  source_name text;
begin
  source_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'business_name'), ''),
    nullif(trim(split_part(coalesce(new.email, ''), '@', 1)), ''),
    'Business'
  );

  base_slug := public.trustdrop_make_slug(source_name);
  final_slug := base_slug;

  while exists (
    select 1
    from public.businesses
    where slug = final_slug
      and id <> new.id
  ) loop
    final_slug := base_slug || '-' || suffix;
    suffix := suffix + 1;
  end loop;

  insert into public.businesses (id, email, business_name, slug)
  values (new.id, new.email, source_name, final_slug)
  on conflict (id) do update
    set email = excluded.email,
        business_name = coalesce(
          nullif(public.businesses.business_name, ''),
          excluded.business_name
        ),
        slug = case
          when public.businesses.slug is null
            or trim(public.businesses.slug) = ''
            or lower(trim(public.businesses.slug)) in ('undefined', 'null')
          then excluded.slug
          else public.businesses.slug
        end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_trustdrop on auth.users;

create trigger on_auth_user_created_trustdrop
after insert on auth.users
for each row
execute function public.handle_new_trustdrop_business();

-- Repair existing businesses with blank/placeholder slugs.
do $$
declare
  rec record;
  base_slug text;
  final_slug text;
  suffix integer;
begin
  for rec in
    select id, business_name
    from public.businesses
    where slug is null
       or trim(slug) = ''
       or lower(trim(slug)) in ('undefined', 'null')
  loop
    base_slug := public.trustdrop_make_slug(rec.business_name);
    final_slug := base_slug;
    suffix := 1;

    while exists (
      select 1
      from public.businesses
      where slug = final_slug
        and id <> rec.id
    ) loop
      final_slug := base_slug || '-' || suffix;
      suffix := suffix + 1;
    end loop;

    update public.businesses
    set slug = final_slug
    where id = rec.id;
  end loop;
end;
$$;

-- Repair auth users that were created before this trigger and have no business row.
do $$
declare
  rec record;
  source_name text;
  base_slug text;
  final_slug text;
  suffix integer;
begin
  for rec in
    select u.id, u.email, u.raw_user_meta_data
    from auth.users u
    left join public.businesses b on b.id = u.id
    where b.id is null
  loop
    source_name := coalesce(
      nullif(trim(rec.raw_user_meta_data->>'business_name'), ''),
      nullif(trim(split_part(coalesce(rec.email, ''), '@', 1)), ''),
      'Business'
    );

    base_slug := public.trustdrop_make_slug(source_name);
    final_slug := base_slug;
    suffix := 1;

    while exists (select 1 from public.businesses where slug = final_slug) loop
      final_slug := base_slug || '-' || suffix;
      suffix := suffix + 1;
    end loop;

    insert into public.businesses (id, email, business_name, slug)
    values (rec.id, rec.email, source_name, final_slug)
    on conflict (id) do nothing;
  end loop;
end;
$$;
