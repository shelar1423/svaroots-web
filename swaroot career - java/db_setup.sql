-- Run this in phpMyAdmin SQL tab

CREATE DATABASE IF NOT EXISTS svaroots;
USE svaroots;

CREATE TABLE IF NOT EXISTS applications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(20),
  cv_file    VARCHAR(255),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
