package com.gestion.notes_backend.classes.application.dto;

import jakarta.validation.constraints.NotBlank;

public record ClasseRequest(
        @NotBlank String nom,
        @NotBlank String niveau,
        @NotBlank String annee
) {}