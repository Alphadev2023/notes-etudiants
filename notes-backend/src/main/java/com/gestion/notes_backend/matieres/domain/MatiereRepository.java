package com.gestion.notes_backend.matieres.domain;

import java.util.List;
import java.util.Optional;

public interface MatiereRepository {
    Matiere save(Matiere matiere);
    Optional<Matiere> findById(Long id);
    List<Matiere> findByClasseId(Long classeId);
    List<Matiere> findByClasseIdAndSemestre(Long classeId, Integer semestre);
    boolean existsByCode(String code);
    void deleteById(Long id);
}