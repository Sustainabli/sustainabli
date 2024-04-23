CREATE DATABASE sustainabli;

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  code VARCHAR(5) PRIMARY KEY NOT NULL,
  name VARCHAR(50) NOT NULL
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  organization_code VARCHAR(5) REFERENCES organizations(code)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  name VARCHAR(50) NOT NULL,
  UNIQUE(organization_code, name)
);

-- Create sensor_info table
CREATE TABLE IF NOT EXISTS sensor_info (
  id VARCHAR(30) PRIMARY KEY NOT NULL,
  fume_hood_name VARCHAR(30) NOT NULL,
  organization_code VARCHAR(5) REFERENCES organizations(code)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  UNIQUE(id, fume_hood_name)
);

-- Create sensor_data table with additional columns
CREATE TABLE IF NOT EXISTS sensor_data (
  id VARCHAR(30) REFERENCES sensor_info(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  status VARCHAR(30),
  error_message VARCHAR(100),
  lab VARCHAR(255),
  account_type VARCHAR(50),
  joined DATE,
  preferred_hood VARCHAR(50),
  efficiency_score VARCHAR(50)
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  email VARCHAR(50) PRIMARY KEY NOT NULL,
  name VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL,
  organization_code VARCHAR(5),
  group_name VARCHAR(50)
);

-- Create group_fume_hoods table
CREATE TABLE IF NOT EXISTS group_fume_hoods (
  organization_code VARCHAR(5),
  group_name VARCHAR(50),
  sensor_id VARCHAR(30) REFERENCES sensor_info(id),
  fume_hood_name VARCHAR(50),
  FOREIGN KEY (organization_code, group_name) REFERENCES groups(organization_code, name)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  FOREIGN KEY (sensor_id, fume_hood_name) REFERENCES sensor_info(id, fume_hood_name)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

