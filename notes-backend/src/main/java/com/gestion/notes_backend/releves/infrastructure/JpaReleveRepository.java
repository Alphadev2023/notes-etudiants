package com.gestion.notes_backend.releves.infrastructure;

import com.gestion.notes_backend.releves.domain.Releve;
import com.gestion.notes_backend.releves.domain.ReleveRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaReleveRepository extends JpaRepository<Releve, Long>, ReleveRepository {
    List<Releve> findByEtudiantId(Long etudiantId);
    List<Releve> findByClasseId(Long classeId);
    Optional<Releve> findByEtudiantIdAndClasseIdAndSemestreAndAnnee(
            Long etudiantId, Long classeId, Integer semestre, String annee);
}