package com.gestion.notes_backend.releves.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "releves")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Releve {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "etudiant_id", nullable = false)
    private Long etudiantId;

    @Column(name = "classe_id", nullable = false)
    private Long classeId;

    @Column(nullable = false)
    private Integer semestre;

    @Column(nullable = false)
    private String annee;

    @Column(name = "moyenne_gen", precision = 5, scale = 2)
    private BigDecimal moyenneGen;

    @Builder.Default
    private String statut = "ADMIS";

    @Column(name = "fichier_pdf")
    private String fichierPdf;

    @Builder.Default
    private LocalDateTime generatedAt = LocalDateTime.now();
}