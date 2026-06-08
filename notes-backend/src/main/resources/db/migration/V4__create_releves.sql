CREATE TABLE releves (
                         id           BIGSERIAL PRIMARY KEY,
                         etudiant_id  BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                         classe_id    BIGINT       NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
                         semestre     INTEGER      NOT NULL CHECK (semestre IN (1, 2)),
                         annee        VARCHAR(20)  NOT NULL,
                         moyenne_gen  NUMERIC(5,2),
                         statut       VARCHAR(30)  NOT NULL DEFAULT 'ADMIS',
                         fichier_pdf  VARCHAR(255),
                         generated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_releves_etudiant ON releves(etudiant_id);
CREATE INDEX idx_releves_classe   ON releves(classe_id);