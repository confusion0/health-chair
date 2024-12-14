CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  sex ENUM('m', 'f'),
  birth_year INT,
  weight DOUBLE,
  height DOUBLE,
  heart_rate INT,
  blood_sugar DOUBLE,
  conditions TEXT,
  symptoms TEXT
);
