-- Updates sensor_info table to have building and room columns
ALTER TABLE sensor_info
ADD building VARCHAR(100),
ADD room VARCHAR(100);
