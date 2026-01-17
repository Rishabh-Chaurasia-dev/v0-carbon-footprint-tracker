-- Add validation fields to activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS location_accuracy DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS location_address TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Update the trigger to only add points for approved activities
CREATE OR REPLACE FUNCTION update_user_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update totals when activity status changes to 'approved'
  IF TG_OP = 'UPDATE' AND NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE profiles
    SET 
      total_points = total_points + NEW.points_earned,
      carbon_saved_kg = carbon_saved_kg + NEW.carbon_saved_kg,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the old trigger and create new one for updates
DROP TRIGGER IF EXISTS on_activity_created ON activities;

CREATE TRIGGER on_activity_status_changed
  AFTER UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_user_totals();

-- Create function to check daily activity limit
CREATE OR REPLACE FUNCTION check_daily_activity_limit(p_user_id UUID, p_activity_type_id UUID)
RETURNS INTEGER AS $$
DECLARE
  daily_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO daily_count
  FROM activities
  WHERE user_id = p_user_id
    AND activity_type_id = p_activity_type_id
    AND DATE(created_at) = CURRENT_DATE;
  RETURN daily_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add daily_limit column to activity_types
ALTER TABLE activity_types
ADD COLUMN IF NOT EXISTS daily_limit INTEGER DEFAULT 3;

-- Update activity types with appropriate daily limits
UPDATE activity_types SET daily_limit = 1 WHERE name = 'Solar Energy Generation';
UPDATE activity_types SET daily_limit = 5 WHERE name = 'Reusable Bag Usage';
UPDATE activity_types SET daily_limit = 2 WHERE name IN ('EV/Hybrid Driving', 'Public Transport');
UPDATE activity_types SET daily_limit = 3 WHERE name IN ('Cycling', 'Volunteering', 'Community Gardening');
UPDATE activity_types SET daily_limit = 5 WHERE name IN ('Tree Plantation', 'Composting', 'Recycling');
