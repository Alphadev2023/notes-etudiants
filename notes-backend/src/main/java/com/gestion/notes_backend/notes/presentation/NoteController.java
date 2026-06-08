package com.gestion.notes_backend.notes.presentation;

import com.gestion.notes_backend.notes.application.NoteService;
import com.gestion.notes_backend.notes.application.dto.MoyenneResponse;
import com.gestion.notes_backend.notes.application.dto.NoteRequest;
import com.gestion.notes_backend.notes.application.dto.NoteResponse;
import com.gestion.notes_backend.identity.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT')")
    public ResponseEntity<NoteResponse> create(
            @Valid @RequestBody NoteRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(noteService.create(request, user.getId()));
    }

    @GetMapping("/etudiant/{etudiantId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_ETUDIANT')")
    public ResponseEntity<List<NoteResponse>> findByEtudiant(@PathVariable Long etudiantId) {
        return ResponseEntity.ok(noteService.findByEtudiant(etudiantId));
    }

    @GetMapping("/enseignant/{enseignantId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT')")
    public ResponseEntity<List<NoteResponse>> findByEnseignant(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(noteService.findByEnseignant(enseignantId));
    }

    @GetMapping("/moyenne/etudiant/{etudiantId}/classe/{classeId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_ETUDIANT')")
    public ResponseEntity<MoyenneResponse> calculerMoyenne(
            @PathVariable Long etudiantId,
            @PathVariable Long classeId) {
        return ResponseEntity.ok(noteService.calculerMoyenne(etudiantId, classeId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT')")
    public ResponseEntity<NoteResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.update(id, request, user.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}