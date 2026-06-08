package com.gestion.notes_backend.classes.domain;

import java.util.List;
import java.util.Optional;

public interface ClasseRepository {
    Classe save(Classe classe);
    Optional<Classe> findById(Long id);
    List<Classe> findAll();
    List<Classe> findByEnseignantIdsContaining(Long enseignantId);
    List<Classe> findByEtudiantIdsContaining(Long etudiantId);
    boolean existsByNom(String nom);
    void deleteById(Long id);
}