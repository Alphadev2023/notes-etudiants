package com.gestion.notes_backend.matieres.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "matieres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Matiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String code;

    @Embedded
    @AttributeOverride(name = "valeur", column = @Column(name = "coefficient"))
    private Coefficient coefficient;

    @Column(nullable = false)
    private Integer semestre;

    @Column(name = "classe_id", nullable = false)
    private Long classeId;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}