package com.gestion.notes_backend.notes.domain;

import java.util.List;
import java.util.Optional;

public interface NoteRepository {
    Note save(Note note);
    Optional<Note> findById(Long id);
    List<Note> findByEtudiantId(Long etudiantId);
    List<Note> findByMatiereId(Long matiereId);
    List<Note> findByEtudiantIdAndMatiereId(Long etudiantId, Long matiereId);
    List<Note> findByEnseignantId(Long enseignantId);
    boolean existsByEtudiantIdAndMatiereIdAndTypeNote(Long etudiantId, Long matiereId, String typeNote);
    void deleteById(Long id);
}