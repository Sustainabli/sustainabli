DELETE FROM groups;
DELETE FROM sensor_data;
DELETE FROM sensor_info;
DELETE FROM accounts;
DELETE FROM organizations;

-- Mock data queries to make testing easier
INSERT INTO organizations (code, name) VALUES ('TTT', 'TestOrganization');

INSERT INTO sensor_info (id, fume_hood_name, organization_code) VALUES ('testMac', 'testFumeHood', 'TTT');
INSERT INTO sensor_info (id, fume_hood_name, organization_code) VALUES ('testMac2', 'testFumeHood2', 'TTT');

INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac','2023-02-21 00:37:04', 1.12, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac','2023-02-21 00:37:04', 10.13, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac','2023-02-21 00:37:04', 20.14, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac','2023-02-21 00:37:04', 30.15, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac','2023-02-21 00:37:04', 40.16, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac','2023-02-21 00:37:04', 50.17, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac2','2023-02-21 00:37:04', 60, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac2','2023-02-21 00:37:04', 70, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac2','2023-02-21 00:37:04', 80, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac2','2023-02-21 00:37:04', 90, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac2','2023-02-21 00:37:04', 45, 'Good', '');
INSERT INTO sensor_data (id, time, value, status, error_message) VALUES ('testMac2','2023-02-21 00:37:04', 35, 'Good', '');

INSERT INTO accounts (email, name, role, organization_code, group_name)
VALUES
   ('dragontt16@gmail.com', 'TestSuperAdmin', 'super_admin', '', ''),
   ('mli25782@gmail.com', 'TestOrganizationAdmin', 'organization_admin', 'TTT', '');

INSERT INTO groups (organization_code, name, sensors) VALUES ('TTT', 'TestGroup', ARRAY['testMac']);
