CREATE TABLE roles (
                       id      BIGSERIAL PRIMARY KEY,
                       name    VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
                       id         BIGSERIAL PRIMARY KEY,
                       nom        VARCHAR(100) NOT NULL,
                       prenom     VARCHAR(100) NOT NULL,
                       email      VARCHAR(150) NOT NULL UNIQUE,
                       password   VARCHAR(255) NOT NULL,
                       actif      BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                       updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
                            user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                            role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
                            PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_users_email ON users(email);