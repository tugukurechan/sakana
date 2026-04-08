-- Table: sakana001.post_image
--
-- 1 post : N images
-- sort_order で表示順を管理する（小さいほど先）
CREATE SCHEMA IF NOT EXISTS sakana001;

-- 注意: 先に create_post_table.sql で sakana001.post が作られている必要があります
CREATE TABLE IF NOT EXISTS sakana001.post_image
(
    id SERIAL PRIMARY KEY,
    post_id integer NOT NULL REFERENCES sakana001.post(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_post_image_post_id_sort
    ON sakana001.post_image (post_id, sort_order, id);

