-- Create admin user via Supabase Auth
-- Ensures email is confirmed and sets basic metadata
select auth.create_user(
  email := 'admin@neonmultimarcas.com',
  password := 'admin123',
  email_confirm := true
);

-- Optional: enrich user metadata for admin identification
update auth.users
set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role','admin','name','Admin')
where email = 'admin@neonmultimarcas.com';
