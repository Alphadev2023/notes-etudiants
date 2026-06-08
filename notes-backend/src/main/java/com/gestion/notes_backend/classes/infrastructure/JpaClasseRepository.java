package com.gestion.notes_backend.classes.infrastructure;

import com.gestion.notes_backend.classes.domain.Classe;
import com.gestion.notes_backend.classes.domain.ClasseRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaClasseRepository extends JpaRepository<Classe, Long>, ClasseRepository {
    List<Classe> findByEnseignantIdsContaining(Long enseignantId);
    List<Classe> findByEtudiantIdsContaining(Long etudiantId);
    boolean existsByNom(String nom);
}