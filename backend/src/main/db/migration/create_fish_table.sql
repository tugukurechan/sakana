-- Table: sakana001.fish

CREATE TABLE IF NOT EXISTS sakana001.fish
(
    id SERIAL PRIMARY KEY,               -- 魚ID
    name VARCHAR(100) NOT NULL,          -- 魚の名前
    scientific_name VARCHAR(150),        -- 学名（任意）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);