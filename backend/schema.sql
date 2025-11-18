-- LeaveSync Database Schema
-- Create database first: CREATE DATABASE leavesync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE leavesync;

-- Users table
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(100),
  state VARCHAR(50) DEFAULT 'Selangor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leave table
CREATE TABLE IF NOT EXISTS leave_record (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  leave_type VARCHAR(50) DEFAULT 'Normal',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  INDEX idx_dates (start_date, end_date),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Public holidays table
CREATE TABLE IF NOT EXISTS public_holiday (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  state VARCHAR(50) NOT NULL,
  holiday_name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'National',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_holiday (date, state),
  INDEX idx_date_state (date, state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
