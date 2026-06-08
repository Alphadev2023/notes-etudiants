package com.gestion.notes_backend.notes.application.dto;

import com.gestion.notes_backend.notes.domain.Note;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record NoteResponse(
        Long id,
        BigDecimal valeur,
        String typeNote,
        String commentaire,
        Long etudiantId,
        Long matiereId,
        Long enseignantId,
        LocalDateTime createdAt
) {
    public static NoteResponse from(Note n) {
        return new NoteResponse(
                n.getId(),
                n.getValeur(),
                n.getTypeNote(),
                n.getCommentaire(),
                n.getEtudiantId(),
                n.getMatiereId(),
                n.getEnseignantId(),
                n.getCreatedAt()
        );
    }
}