CREATE TABLE leaves1 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  -- type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users2 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('employee', 'admin') DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

