package com.gestion.notes_backend.notes.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal valeur;

    @Column(name = "type_note", nullable = false)
    private String typeNote;

    private String commentaire;

    @Column(name = "etudiant_id", nullable = false)
    private Long etudiantId;

    @Column(name = "matiere_id", nullable = false)
    private Long matiereId;

    @Column(name = "enseignant_id", nullable = false)
    private Long enseignantId;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}