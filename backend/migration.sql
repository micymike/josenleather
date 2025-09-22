-- Payment table for Pesapal integration
CREATE TABLE IF NOT EXISTS "payment" (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  provider VARCHAR(50),
  status VARCHAR(50),
  reference VARCHAR(255) UNIQUE,
  amount NUMERIC(12,2),
  paid_at TIMESTAMP,
  metadata JSONB,
  callback_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant sequence permissions to your database user
GRANT ALL ON SEQUENCE payment_id_seq TO postgres;
GRANT ALL ON SEQUENCE payment_id_seq TO PUBLIC;
