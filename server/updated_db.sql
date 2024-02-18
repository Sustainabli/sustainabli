ALTER TABLE sensor_data
ADD COLUMN lab VARCHAR(255),
ADD COLUMN account_type VARCHAR(50),
ADD COLUMN joined DATE,
ADD COLUMN preferred_hood VARCHAR(50),
ADD COLUMN efficiency_score VARCHAR(50);


INSERT INTO sensor_data (id, time, value, status, error_message, lab, account_type, joined, preferred_hood, efficiency_score) VALUES
('sensor1', '2023-02-21 00:37:04', 1.12, 'Good', '', 'Iribe Lab', 'Lecturer', '1970-01-01', '13', 'Very Low'),
('sensor2', '2023-02-21 00:37:04', 10.13, 'Good', '', 'Letters and Science Lab', 'Professor', '2003-12-01', '11', 'Medium');
