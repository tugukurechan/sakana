-- Table: sakana001.post

CREATE TABLE IF NOT EXISTS sakana001.post
(
    id SERIAL PRIMARY KEY, -- 自動採番
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    amount INTEGER, -- 釣った数
    size NUMERIC(5,2), -- 小数2桁まで、例: 12.34cm
    caught_at DATE, -- 釣った日
    location VARCHAR(255), -- 場所
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 登録日時
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 更新日時
    author_id INTEGER -- ユーザーID
);

-- 画像は post_image テーブルで管理する（1:N）