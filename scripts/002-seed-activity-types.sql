-- Seed activity types with realistic values
INSERT INTO activity_types (name, description, points_per_unit, unit, carbon_factor, icon, requires_photo) VALUES
  ('Solar Energy', 'Electricity generated from solar panels', 10, 'kWh', 0.42, 'sun', false),
  ('Tote Bag Usage', 'Using reusable tote bag instead of plastic', 5, 'use', 0.033, 'shopping-bag', true),
  ('EV Driving', 'Distance traveled in electric vehicle', 8, 'km', 0.12, 'car', false),
  ('Hybrid Driving', 'Distance traveled in hybrid vehicle', 4, 'km', 0.06, 'car', false),
  ('Public Transport', 'Distance traveled by public transportation', 6, 'km', 0.089, 'bus', false),
  ('Cycling', 'Distance cycled instead of driving', 10, 'km', 0.21, 'bike', false),
  ('Tree Planting', 'Trees planted in community or personal space', 100, 'tree', 21.77, 'tree-deciduous', true),
  ('Beach/Park Cleanup', 'Volunteering for environmental cleanup', 50, 'hour', 2.5, 'trash', true),
  ('Composting', 'Food waste composted instead of landfill', 15, 'kg', 0.89, 'leaf', false),
  ('Recycling', 'Materials properly recycled', 8, 'kg', 0.5, 'recycle', false),
  ('Meatless Meal', 'Plant-based meal instead of meat', 3, 'meal', 2.5, 'salad', true),
  ('Community Garden', 'Hours spent in community gardening', 30, 'hour', 1.5, 'flower', true);
