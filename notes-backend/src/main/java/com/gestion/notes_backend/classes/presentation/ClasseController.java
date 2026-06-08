package com.gestion.notes_backend.classes.presentation;

import com.gestion.notes_backend.classes.application.ClasseService;
import com.gestion.notes_backend.classes.application.dto.ClasseRequest;
import com.gestion.notes_backend.classes.application.dto.ClasseResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseService classeService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ClasseResponse> create(@Valid @RequestBody ClasseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(classeService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ClasseResponse>> findAll() {
        return ResponseEntity.ok(classeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClasseResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(classeService.findById(id));
    }

    @GetMapping("/enseignant/{enseignantId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT')")
    public ResponseEntity<List<ClasseResponse>> findByEnseignant(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(classeService.findByEnseignant(enseignantId));
    }

    @GetMapping("/etudiant/{etudiantId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ETUDIANT')")
    public ResponseEntity<List<ClasseResponse>> findByEtudiant(@PathVariable Long etudiantId) {
        return ResponseEntity.ok(classeService.findByEtudiant(etudiantId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ClasseResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody ClasseRequest request) {
        return ResponseEntity.ok(classeService.update(id, request));
    }

    @PostMapping("/{classeId}/enseignants/{enseignantId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ClasseResponse> ajouterEnseignant(@PathVariable Long classeId,
                                                            @PathVariable Long enseignantId) {
        return ResponseEntity.ok(classeService.ajouterEnseignant(classeId, enseignantId));
    }

    @PostMapping("/{classeId}/etudiants/{etudiantId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ClasseResponse> ajouterEtudiant(@PathVariable Long classeId,
                                                          @PathVariable Long etudiantId) {
        return ResponseEntity.ok(classeService.ajouterEtudiant(classeId, etudiantId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}