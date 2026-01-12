export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  total_points: number
  carbon_saved_kg: number
  created_at: string
  updated_at: string
}

export interface ActivityType {
  id: string
  name: string
  description: string | null
  points_per_unit: number
  unit: string
  carbon_factor: number
  icon: string | null
  requires_photo: boolean
  created_at: string
}

export interface Activity {
  id: string
  user_id: string
  activity_type_id: string
  quantity: number
  points_earned: number
  carbon_saved_kg: number
  notes: string | null
  photo_url: string | null
  verified: boolean
  created_at: string
  activity_types?: ActivityType
}

export interface Voucher {
  id: string
  name: string
  description: string | null
  points_required: number
  value_amount: number | null
  company_name: string
  company_logo: string | null
  total_available: number
  remaining: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export interface Redemption {
  id: string
  user_id: string
  voucher_id: string
  points_spent: number
  redemption_code: string
  redeemed_at: string
  status: "pending" | "used" | "expired"
  vouchers?: Voucher
}
