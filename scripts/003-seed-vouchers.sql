-- Seed sample vouchers
INSERT INTO vouchers (name, description, points_required, value_amount, company_name, company_logo, total_available, remaining, expires_at, is_active) VALUES
  ('Coffee Shop Discount', '20% off at GreenBean Cafe', 500, 5.00, 'GreenBean Cafe', NULL, 100, 100, NOW() + INTERVAL '90 days', true),
  ('Eco Store Credit', '$10 store credit at EcoMart', 1000, 10.00, 'EcoMart', NULL, 50, 50, NOW() + INTERVAL '60 days', true),
  ('Plant Nursery Voucher', '$15 off at Green Thumb Nursery', 1500, 15.00, 'Green Thumb Nursery', NULL, 30, 30, NOW() + INTERVAL '120 days', true),
  ('Farmers Market Pass', 'Free entry + $5 credit', 800, 8.00, 'Local Farmers Market', NULL, 75, 75, NOW() + INTERVAL '30 days', true),
  ('Electric Bike Rental', '1 hour free e-bike rental', 600, 12.00, 'CityBikes', NULL, 200, 200, NOW() + INTERVAL '180 days', true),
  ('Sustainable Fashion', '$25 off eco-friendly clothing', 2500, 25.00, 'EcoWear', NULL, 20, 20, NOW() + INTERVAL '90 days', true),
  ('Solar Panel Cleaning', 'Free solar panel cleaning service', 3000, 50.00, 'SunClean Services', NULL, 15, 15, NOW() + INTERVAL '365 days', true),
  ('Tree Adoption Certificate', 'Adopt a tree in your name', 5000, 100.00, 'Forest Foundation', NULL, 10, 10, NULL, true);
