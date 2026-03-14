// lib/types.ts

export type ActivityCategory = 'Transportation' | 'Energy' | 'Food';

export interface ActivityType {
  id: string;
  name: string;
  description: string | null;
  points_per_unit: number;
  unit_name: string;
  category: ActivityCategory;
  carbon_saving_per_unit: number;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type_id: string;
  amount: number;
  points_earned: number;
  carbon_saved: number;
  logged_at: string;
  notes: string | null;
  activity_type?: ActivityType;
}
