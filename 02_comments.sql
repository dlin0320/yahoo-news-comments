CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    article_link TEXT REFERENCES articles(link),
    text TEXT NOT NULL
);