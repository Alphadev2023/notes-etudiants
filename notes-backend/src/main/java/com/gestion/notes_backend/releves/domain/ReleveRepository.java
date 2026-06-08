package com.gestion.notes_backend.releves.domain;

import java.util.List;
import java.util.Optional;

public interface ReleveRepository {
    Releve save(Releve releve);
    Optional<Releve> findById(Long id);
    List<Releve> findByEtudiantId(Long etudiantId);
    List<Releve> findByClasseId(Long classeId);
    Optional<Releve> findByEtudiantIdAndClasseIdAndSemestreAndAnnee(
            Long etudiantId, Long classeId, Integer semestre, String annee);
    void deleteById(Long id);
}