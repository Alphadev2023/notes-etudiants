package com.gestion.notes_backend.matieres.infrastructure;

import com.gestion.notes_backend.matieres.domain.Matiere;
import com.gestion.notes_backend.matieres.domain.MatiereRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaMatiereRepository extends JpaRepository<Matiere, Long>, MatiereRepository {
    List<Matiere> findByClasseId(Long classeId);
    List<Matiere> findByClasseIdAndSemestre(Long classeId, Integer semestre);
    boolean existsByCode(String code);
}