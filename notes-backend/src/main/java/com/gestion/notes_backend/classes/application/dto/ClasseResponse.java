package com.gestion.notes_backend.classes.application.dto;

import com.gestion.notes_backend.classes.domain.Classe;

import java.util.Set;

public record ClasseResponse(
        Long id,
        String nom,
        String niveau,
        String annee,
        boolean actif,
        Set<Long> enseignantIds,
        Set<Long> etudiantIds
) {
    public static ClasseResponse from(Classe c) {
        return new ClasseResponse(
                c.getId(),
                c.getNom(),
                c.getNiveau(),
                c.getAnnee(),
                c.isActif(),
                c.getEnseignantIds(),
                c.getEtudiantIds()
        );
    }
}