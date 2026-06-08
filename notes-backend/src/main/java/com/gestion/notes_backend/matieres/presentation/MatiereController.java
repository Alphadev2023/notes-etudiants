package com.gestion.notes_backend.matieres.presentation;

import com.gestion.notes_backend.matieres.application.MatiereService;
import com.gestion.notes_backend.matieres.application.dto.MatiereRequest;
import com.gestion.notes_backend.matieres.application.dto.MatiereResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matieres")
@RequiredArgsConstructor
public class MatiereController {

    private final MatiereService matiereService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<MatiereResponse> create(@Valid @RequestBody MatiereRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(matiereService.create(request));
    }

    @GetMapping("/classe/{classeId}")
    public ResponseEntity<List<MatiereResponse>> findByClasse(@PathVariable Long classeId) {
        return ResponseEntity.ok(matiereService.findByClasse(classeId));
    }

    @GetMapping("/classe/{classeId}/semestre/{semestre}")
    public ResponseEntity<List<MatiereResponse>> findByClasseAndSemestre(
            @PathVariable Long classeId,
            @PathVariable Integer semestre) {
        return ResponseEntity.ok(matiereService.findByClasseAndSemestre(classeId, semestre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatiereResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(matiereService.findById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<MatiereResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody MatiereRequest request) {
        return ResponseEntity.ok(matiereService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        matiereService.delete(id);
        return ResponseEntity.noContent().build();
    }
}