package com.gestion.notes_backend.notes.application.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record NoteRequest(
        @NotNull @DecimalMin("0") @DecimalMax("20") BigDecimal valeur,
        @NotBlank String typeNote,
        String commentaire,
        @NotNull Long etudiantId,
        @NotNull Long matiereId
) {}