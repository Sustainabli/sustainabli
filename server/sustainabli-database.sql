CREATE DATABASE sustainabli;

CREATE TABLE sensors (
  time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  sensor_name VARCHAR(10)
);

CREATE TABLE accounts (
  email VARCHAR(50) PRIMARY KEY NOT NULL,
  name VARCHAR(20) NOT NULL,
  fumehoods varchar[]
);
