package com.gestion.notes_backend.notes.application.dto;

import com.gestion.notes_backend.notes.domain.Moyenne;

public record MoyenneResponse(
        double valeur,
        int totalNotes,
        double coefficientTotal,
        String mention,
        boolean admis
) {
    public static MoyenneResponse from(Moyenne m) {
        return new MoyenneResponse(
                m.getValeur(),
                m.getTotalNotes(),
                m.getCoefficientTotal(),
                m.getMention(),
                m.isAdmis()
        );
    }
}