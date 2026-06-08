package com.gestion.notes_backend.notes.infrastructure;

import com.gestion.notes_backend.notes.domain.Note;
import com.gestion.notes_backend.notes.domain.NoteRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaNoteRepository extends JpaRepository<Note, Long>, NoteRepository {
    List<Note> findByEtudiantId(Long etudiantId);
    List<Note> findByMatiereId(Long matiereId);
    List<Note> findByEtudiantIdAndMatiereId(Long etudiantId, Long matiereId);
    List<Note> findByEnseignantId(Long enseignantId);
    boolean existsByEtudiantIdAndMatiereIdAndTypeNote(Long etudiantId, Long matiereId, String typeNote);
}