package com.gestion.notes_backend.matieres.domain;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Coefficient {

    private BigDecimal valeur;

    public static Coefficient of(double valeur) {
        if (valeur <= 0) throw new IllegalStateException("Le coefficient doit être positif");
        return new Coefficient(BigDecimal.valueOf(valeur));
    }

    public double getDoubleValue() {
        return valeur != null ? valeur.doubleValue() : 0;
    }
}