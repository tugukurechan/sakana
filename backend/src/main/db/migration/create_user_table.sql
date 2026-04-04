-- Table: sakana001.user

CREATE TABLE IF NOT EXISTS sakana001.user
(
    id SERIAL PRIMARY KEY,               -- ユーザーID
    username VARCHAR(50) NOT NULL,       -- ログイン名
    display_name VARCHAR(100),           -- 表示名
    email VARCHAR(150),                  -- メールアドレス
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);