-- Create profiles for any existing users that don't have one
-- This fixes the issue for users who signed up before the trigger was working

INSERT INTO public.profiles (id, full_name, total_points, carbon_saved_kg)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  0,
  0
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
