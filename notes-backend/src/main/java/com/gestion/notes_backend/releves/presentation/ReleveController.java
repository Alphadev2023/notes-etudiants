package com.gestion.notes_backend.releves.presentation;

import com.gestion.notes_backend.releves.application.ReleveService;
import com.gestion.notes_backend.releves.application.dto.ReleveResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
            @RequestParam String annee) {
        return ResponseEntity.ok(releveService.generer(etudiantId, classeId, semestre, annee));
    }

    @GetMapping("/etudiant/{etudiantId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_ETUDIANT')")
    public ResponseEntity<List<ReleveResponse>> findByEtudiant(@PathVariable Long etudiantId) {
        return ResponseEntity.ok(releveService.findByEtudiant(etudiantId));
    }

    @GetMapping("/classe/{classeId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT')")
    public ResponseEntity<List<ReleveResponse>> findByClasse(@PathVariable Long classeId) {
        return ResponseEntity.ok(releveService.findByClasse(classeId));
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_ETUDIANT')")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Long id) {
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
}