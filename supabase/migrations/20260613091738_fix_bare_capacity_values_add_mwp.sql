UPDATE projects
SET capacity = capacity || ' MWp'
WHERE capacity ~ '^[0-9]+$';
