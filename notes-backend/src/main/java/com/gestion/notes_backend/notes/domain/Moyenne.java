package com.gestion.notes_backend.notes.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Moyenne {

    private double valeur;
    private int totalNotes;
    private double coefficientTotal;

    public static Moyenne of(double valeur, int totalNotes, double coefficientTotal) {
        return new Moyenne(valeur, totalNotes, coefficientTotal);
    }

    public String getMention() {
        if (valeur >= 16) return "TRES_BIEN";
        if (valeur >= 14) return "BIEN";
        if (valeur >= 12) return "ASSEZ_BIEN";
        if (valeur >= 10) return "PASSABLE";
        return "INSUFFISANT";
    }

    public boolean isAdmis() {
        return valeur >= 10;
    }
}