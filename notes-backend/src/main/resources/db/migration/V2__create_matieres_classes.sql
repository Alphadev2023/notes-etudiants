CREATE TABLE classes (
                         id          BIGSERIAL PRIMARY KEY,
                         nom         VARCHAR(100) NOT NULL UNIQUE,
                         niveau      VARCHAR(50)  NOT NULL,
                         annee       VARCHAR(20)  NOT NULL,
                         actif       BOOLEAN      NOT NULL DEFAULT TRUE,
                         created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE matieres (
                          id          BIGSERIAL PRIMARY KEY,
                          nom         VARCHAR(150) NOT NULL,
                          code        VARCHAR(20)  NOT NULL UNIQUE,
                          coefficient NUMERIC(4,2) NOT NULL DEFAULT 1.0,
                          semestre    INTEGER      NOT NULL CHECK (semestre IN (1, 2)),
                          classe_id   BIGINT       NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
                          created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE enseignant_classes (
                                    enseignant_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                    classe_id     BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
                                    PRIMARY KEY (enseignant_id, classe_id)
);

CREATE TABLE etudiant_classes (
                                  etudiant_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                  classe_id   BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
                                  PRIMARY KEY (etudiant_id, classe_id)
);

CREATE INDEX idx_matieres_classe ON matieres(classe_id);
CREATE INDEX idx_matieres_semestre ON matieres(semestre);