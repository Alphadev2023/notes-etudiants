package com.gestion.notes_backend.classes.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "classes")
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(nullable = false)
    private String niveau;

    @Column(nullable = false)
    private String annee;

    private boolean actif = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "enseignant_classes",
            joinColumns = @JoinColumn(name = "classe_id"))
    @Column(name = "enseignant_id")
    private Set<Long> enseignantIds = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "etudiant_classes",
            joinColumns = @JoinColumn(name = "classe_id"))
    @Column(name = "etudiant_id")
    private Set<Long> etudiantIds = new HashSet<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    public Classe() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }

    public String getAnnee() { return annee; }
    public void setAnnee(String annee) { this.annee = annee; }

    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }

    public Set<Long> getEnseignantIds() { return enseignantIds; }
    public void setEnseignantIds(Set<Long> enseignantIds) { this.enseignantIds = enseignantIds; }

    public Set<Long> getEtudiantIds() { return etudiantIds; }
    public void setEtudiantIds(Set<Long> etudiantIds) { this.etudiantIds = etudiantIds; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}