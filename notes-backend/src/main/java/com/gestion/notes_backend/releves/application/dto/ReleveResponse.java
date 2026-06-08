package com.gestion.notes_backend.releves.application.dto;

import com.gestion.notes_backend.releves.domain.Releve;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReleveResponse(
        Long id,
        Long etudiantId,
        Long classeId,
        Integer semestre,
        String annee,
        BigDecimal moyenneGen,
        String statut,
        String fichierPdf,
        LocalDateTime generatedAt
) {
    public static ReleveResponse from(Releve r) {
        return new ReleveResponse(
                r.getId(),
                r.getEtudiantId(),
                r.getClasseId(),
                r.getSemestre(),
                r.getAnnee(),
                r.getMoyenneGen(),
                r.getStatut(),
                r.getFichierPdf(),
                r.getGeneratedAt()
        );
    }
}