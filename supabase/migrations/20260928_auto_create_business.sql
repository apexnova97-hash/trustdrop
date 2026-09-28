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

-- =========================================================
-- LEGACY ACCOUNT COMPATIBILITY
-- Older businesses may have an ID different from auth.users.id.
-- Allow an authenticated user to access the business that owns
-- their login email. This lets existing customers keep their
-- old business/testimonials without changing primary keys.
-- =========================================================

DROP POLICY IF EXISTS "Users can read their own business"
ON public.businesses;

CREATE POLICY "Users can read their own business"
ON public.businesses
FOR SELECT
TO authenticated
USING (
  id = (SELECT auth.uid())
  OR lower(email) = lower((SELECT auth.jwt() ->> 'email'))
);


-- Existing customers also need to manage testimonials belonging
-- to their legacy business record.

DROP POLICY IF EXISTS "Users can read their business testimonials"
ON public.testimonials;

CREATE POLICY "Users can read their business testimonials"
ON public.testimonials
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id = testimonials.business_id
      AND (
        b.id = (SELECT auth.uid())
        OR lower(b.email) = lower((SELECT auth.jwt() ->> 'email'))
      )
  )
);


DROP POLICY IF EXISTS "Users can update their business testimonials"
ON public.testimonials;

CREATE POLICY "Users can update their business testimonials"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id = testimonials.business_id
      AND (
        b.id = (SELECT auth.uid())
        OR lower(b.email) = lower((SELECT auth.jwt() ->> 'email'))
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id = testimonials.business_id
      AND (
        b.id = (SELECT auth.uid())
        OR lower(b.email) = lower((SELECT auth.jwt() ->> 'email'))
      )
  )
);


DROP POLICY IF EXISTS "Users can delete their business testimonials"
ON public.testimonials;

CREATE POLICY "Users can delete their business testimonials"
ON public.testimonials
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id = testimonials.business_id
      AND (
        b.id = (SELECT auth.uid())
        OR lower(b.email) = lower((SELECT auth.jwt() ->> 'email'))
      )
  )
);

