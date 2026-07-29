package com.gestion.notes_backend.releves.presentation;

import com.gestion.notes_backend.identity.domain.User;
import com.gestion.notes_backend.releves.application.ReleveService;
import com.gestion.notes_backend.releves.application.dto.ReleveResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/releves")
@RequiredArgsConstructor
public class ReleveController {

    private final ReleveService releveService;

    @PostMapping("/generer")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_ETUDIANT')")
    public ResponseEntity<ReleveResponse> generer(
            @RequestParam Long etudiantId,
            @RequestParam Long classeId,
            @RequestParam Integer semestre,
            @RequestParam String annee,
            @AuthenticationPrincipal User user) {
        verifierAcces(user, etudiantId);
        return ResponseEntity.ok(releveService.generer(etudiantId, classeId, semestre, annee));
    }

    @GetMapping("/etudiant/{etudiantId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_ETUDIANT')")
    public ResponseEntity<List<ReleveResponse>> findByEtudiant(
            @PathVariable Long etudiantId,
            @AuthenticationPrincipal User user) {
        verifierAcces(user, etudiantId);
        return ResponseEntity.ok(releveService.findByEtudiant(etudiantId));
    }

    @GetMapping("/classe/{classeId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT')")
    public ResponseEntity<List<ReleveResponse>> findByClasse(@PathVariable Long classeId) {
        return ResponseEntity.ok(releveService.findByClasse(classeId));
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_ETUDIANT')")
    public ResponseEntity<byte[]> exportPdf(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        ReleveResponse releve = releveService.findById(id);
        verifierAcces(user, releve.etudiantId());

        byte[] pdf = releveService.exportPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"releve_" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/classe/{classeId}/excel")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT')")
    public ResponseEntity<byte[]> exportExcel(@PathVariable Long classeId) {
        byte[] excel = releveService.exportExcel(classeId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"notes_classe_" + classeId + ".xlsx\"")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    // Un étudiant ne peut accéder qu'à ses propres relevés ; Admin/Enseignant ont accès à tout
    private void verifierAcces(User user, Long etudiantIdDemande) {
        boolean estEtudiantSeul = user.getRoles().stream()
                .allMatch(r -> r.name().equals("ROLE_ETUDIANT"));
        if (estEtudiantSeul && !user.getId().equals(etudiantIdDemande)) {
            throw new AccessDeniedException("Accès refusé à ce relevé");
        }
    }
}