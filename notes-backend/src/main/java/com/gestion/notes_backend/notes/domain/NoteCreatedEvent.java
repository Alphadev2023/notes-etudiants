package com.gestion.notes_backend.notes.domain;

import org.springframework.modulith.events.Externalized;

@Externalized
public record NoteCreatedEvent(
        Long noteId,
        Long etudiantId,
        Long matiereId,
        double valeur
) {}