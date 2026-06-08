-- Rôles
INSERT INTO roles (name) VALUES ('ROLE_ADMIN'), ('ROLE_ENSEIGNANT'), ('ROLE_ETUDIANT');

-- Utilisateurs (passwords BCrypt de Admin1234!, Enseignant1234!, Etudiant1234!)
INSERT INTO users (nom, prenom, email, password) VALUES
                                                     ('Admin',      'Système',  'admin@notes.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.'),
                                                     ('Dupont',     'Jean',     'enseignant@notes.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.'),
                                                     ('Diallo',     'Mamadou',  'etudiant@notes.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.');

-- Affectation des rôles
INSERT INTO user_roles (user_id, role_id) VALUES
                                              (1, (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')),
                                              (2, (SELECT id FROM roles WHERE name = 'ROLE_ENSEIGNANT')),
                                              (3, (SELECT id FROM roles WHERE name = 'ROLE_ETUDIANT'));

-- Classe de test
INSERT INTO classes (nom, niveau, annee) VALUES
    ('Licence 3 Informatique', 'L3', '2024-2025');

-- Matières de test
INSERT INTO matieres (nom, code, coefficient, semestre, classe_id) VALUES
                                                                       ('Algorithmique Avancée',    'ALGO3',  3.0, 1, 1),
                                                                       ('Base de Données',          'BDD3',   2.5, 1, 1),
                                                                       ('Développement Web',        'WEB3',   2.0, 1, 1),
                                                                       ('Systèmes d''Exploitation', 'SYS3',   2.0, 1, 1),
                                                                       ('Anglais Technique',        'ANG3',   1.5, 1, 1);

-- Affecter l'enseignant à la classe
INSERT INTO enseignant_classes (enseignant_id, classe_id) VALUES (2, 1);

-- Affecter l'étudiant à la classe
INSERT INTO etudiant_classes (etudiant_id, classe_id) VALUES (3, 1);

-- Notes de test pour l'étudiant
INSERT INTO notes (valeur, type_note, etudiant_id, matiere_id, enseignant_id) VALUES
                                                                                  (15.5, 'EXAMEN',  3, 1, 2),
                                                                                  (13.0, 'EXAMEN',  3, 2, 2),
                                                                                  (17.0, 'EXAMEN',  3, 3, 2),
                                                                                  (12.5, 'EXAMEN',  3, 4, 2),
                                                                                  (14.0, 'EXAMEN',  3, 5, 2);