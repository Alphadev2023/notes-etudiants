package com.gestion.notes_backend.matieres.application.dto;

import com.gestion.notes_backend.matieres.domain.Matiere;

public record MatiereResponse(
        Long id,
        String nom,
        String code,
        double coefficient,
        Integer semestre,
        Long classeId
) {
    public static MatiereResponse from(Matiere m) {
        return new MatiereResponse(
                m.getId(),
                m.getNom(),
                m.getCode(),
                m.getCoefficient().getDoubleValue(),
                m.getSemestre(),
                m.getClasseId()
        );
    }
}