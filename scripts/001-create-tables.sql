-- Create profiles table to store user information
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  carbon_saved_kg DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_types table for different eco-friendly activities
CREATE TABLE activity_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  points_per_unit INTEGER NOT NULL,
  unit TEXT NOT NULL,
  carbon_factor DECIMAL(10,4) NOT NULL, -- kg CO2 saved per unit
  icon TEXT,
  requires_photo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table to log user activities
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type_id UUID NOT NULL REFERENCES activity_types(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  points_earned INTEGER NOT NULL,
  carbon_saved_kg DECIMAL(10,2) NOT NULL,
  notes TEXT,
  photo_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vouchers table for rewards
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  value_amount DECIMAL(10,2),
  company_name TEXT NOT NULL,
  company_logo TEXT,
  total_available INTEGER NOT NULL,
  remaining INTEGER NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create redemptions table to track voucher redemptions
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voucher_id UUID NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  redemption_code TEXT NOT NULL UNIQUE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired'))
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- Profiles policies - users can only access their own profile
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Activities policies - users can only manage their own activities
CREATE POLICY "Users can view their own activities" ON activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activities" ON activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own activities" ON activities FOR DELETE USING (auth.uid() = user_id);

-- Redemptions policies - users can only access their own redemptions
CREATE POLICY "Users can view their own redemptions" ON redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own redemptions" ON redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity types and vouchers are readable by all authenticated users
CREATE POLICY "Authenticated users can view activity types" ON activity_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view vouchers" ON vouchers FOR SELECT TO authenticated USING (true);

-- Create function to update user's total points and carbon saved
CREATE OR REPLACE FUNCTION update_user_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    total_points = total_points + NEW.points_earned,
    carbon_saved_kg = carbon_saved_kg + NEW.carbon_saved_kg,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-update totals when activity is added
CREATE TRIGGER on_activity_created
  AFTER INSERT ON activities
  FOR EACH ROW EXECUTE FUNCTION update_user_totals();

-- Create function to deduct points on redemption
CREATE OR REPLACE FUNCTION deduct_points_on_redemption()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    total_points = total_points - NEW.points_spent,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  UPDATE vouchers
  SET remaining = remaining - 1
  WHERE id = NEW.voucher_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for redemptions
CREATE TRIGGER on_redemption_created
  AFTER INSERT ON redemptions
  FOR EACH ROW EXECUTE FUNCTION deduct_points_on_redemption();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
