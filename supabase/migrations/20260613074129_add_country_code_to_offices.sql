ALTER TABLE offices ADD COLUMN IF NOT EXISTS country_code text;

UPDATE offices SET country_code = 'TH' WHERE country = 'Thailand';
UPDATE offices SET country_code = 'IN' WHERE country = 'India';
UPDATE offices SET country_code = 'SG' WHERE country = 'Singapore';
