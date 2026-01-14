-- Fix the profile creation trigger and RLS policy
-- The issue is that during user signup, the trigger tries to insert into profiles
-- but the RLS policy blocks it because auth.uid() might not match or be available yet

-- First, drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with proper error handling and SECURITY DEFINER
-- SECURITY DEFINER allows the function to run with the privileges of the owner (postgres)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, total_points, carbon_saved_kg)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    0,
    0
  );
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the signup
    RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the RLS policy for profiles to allow the trigger function to insert
-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create a new policy that allows inserts where the id matches auth.uid()
-- OR when the insert is done by a service role (for the trigger)
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    auth.uid() IS NULL  -- This allows the trigger to work before auth context is fully set
  );

-- Also ensure the profiles table allows the postgres/service role to insert
-- by granting proper permissions
GRANT INSERT ON profiles TO service_role;
GRANT INSERT ON profiles TO postgres;
