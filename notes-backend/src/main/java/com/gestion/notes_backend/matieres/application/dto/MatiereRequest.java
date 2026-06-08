package com.gestion.notes_backend.matieres.application.dto;

import jakarta.validation.constraints.*;

public record MatiereRequest(
        @NotBlank String nom,
        @NotBlank String code,
        @Positive double coefficient,
        @NotNull @Min(1) @Max(2) Integer semestre,
        @NotNull Long classeId
) {}