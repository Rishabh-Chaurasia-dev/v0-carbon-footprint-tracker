-- Seed activity types with realistic values
INSERT INTO activity_types (name, description, points_per_unit, unit, carbon_factor, icon, requires_photo) VALUES
  ('Solar Energy', 'Electricity generated from solar panels', 10, 'kWh', 0.42, 'sun', false),
  ('EV Driving', 'Distance traveled in electric vehicle', 8, 'km', 0.12, 'car', false),
  ('Hybrid Driving', 'Distance traveled in hybrid vehicle', 4, 'km', 0.06, 'car', false),
  ('Public Transport', 'Distance traveled by public transportation', 6, 'km', 0.089, 'bus', true),
  ('Cycling', 'Distance cycled instead of driving', 10, 'km', 0.21, 'bike', false),
  ('Meatless Meal', 'Plant-based meal instead of meat', 3, 'meal', 2.5, 'salad', true);
