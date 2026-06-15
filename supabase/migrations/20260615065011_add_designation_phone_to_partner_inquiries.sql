ALTER TABLE partner_inquiries
  ADD COLUMN IF NOT EXISTS designation text,
  ADD COLUMN IF NOT EXISTS phone text;
