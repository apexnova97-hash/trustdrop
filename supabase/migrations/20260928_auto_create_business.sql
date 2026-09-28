-- TrustDrop: create a business row automatically for every new Auth user.
-- Run this migration in Supabase SQL Editor once.

CREATE OR REPLACE FUNCTION public.trustdrop_create_business()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  business_name_value text;
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  business_name_value := COALESCE(
    NEW.raw_user_meta_data ->> 'business_name',
    NEW.raw_user_meta_data ->> 'businessName',
    NEW.raw_user_meta_data ->> 'name',
    split_part(NEW.email, '@', 1)
  );

  base_slug := lower(trim(business_name_value));
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '(^-|-$)', '', 'g');

  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'business';
  END IF;

  final_slug := base_slug;

  WHILE EXISTS (
    SELECT 1 FROM public.businesses WHERE slug = final_slug
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  INSERT INTO public.businesses (id, email, business_name, slug)
  VALUES (NEW.id, NEW.email, business_name_value, final_slug)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.trustdrop_create_business();
