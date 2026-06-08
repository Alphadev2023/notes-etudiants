CREATE TABLE notes (
                       id            BIGSERIAL PRIMARY KEY,
                       valeur        NUMERIC(5,2) NOT NULL CHECK (valeur >= 0 AND valeur <= 20),
                       type_note     VARCHAR(50)  NOT NULL,
                       commentaire   TEXT,
                       etudiant_id   BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                       matiere_id    BIGINT       NOT NULL REFERENCES matieres(id) ON DELETE CASCADE,
                       enseignant_id BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                       created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
                       updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
                       CONSTRAINT uq_note_etudiant_matiere_type UNIQUE (etudiant_id, matiere_id, type_note)
);

CREATE INDEX idx_notes_etudiant  ON notes(etudiant_id);
CREATE INDEX idx_notes_matiere   ON notes(matiere_id);
CREATE INDEX idx_notes_enseignant ON notes(enseignant_id);