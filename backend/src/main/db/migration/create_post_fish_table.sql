-- Table: sakana001.post_fish

CREATE TABLE IF NOT EXISTS sakana001.post_fish
(
    post_id integer NOT NULL REFERENCES sakana001.post(id) ON DELETE CASCADE,
    fish_id integer NOT NULL REFERENCES sakana001.fish(id) ON DELETE RESTRICT,
    PRIMARY KEY (post_id, fish_id)
);
