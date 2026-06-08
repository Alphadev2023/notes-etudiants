package com.gestion.notes_backend.releves.application;

import com.gestion.notes_backend.notes.application.MoyenneCalculator;
import com.gestion.notes_backend.notes.domain.Moyenne;
import com.gestion.notes_backend.releves.application.dto.ReleveResponse;
import com.gestion.notes_backend.releves.domain.Releve;
import com.gestion.notes_backend.releves.domain.ReleveRepository;
import com.gestion.notes_backend.shared.exceptions.BusinessException;
import com.gestion.notes_backend.shared.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReleveService {

    private final ReleveRepository releveRepository;
    private final MoyenneCalculator moyenneCalculator;
    private final PdfGeneratorService pdfGeneratorService;
    private final ExcelExportService excelExportService;

    @Transactional
    public ReleveResponse generer(Long etudiantId, Long classeId,
                                  Integer semestre, String annee) {
        releveRepository.findByEtudiantIdAndClasseIdAndSemestreAndAnnee(
                        etudiantId, classeId, semestre, annee)
                .ifPresent(r -> { throw new BusinessException("Relevé déjà généré"); });

        Moyenne moyenne = moyenneCalculator.calculerMoyenneEtudiant(etudiantId, classeId);

        Releve releve = Releve.builder()
                .etudiantId(etudiantId)
                .classeId(classeId)
                .semestre(semestre)
                .annee(annee)
                .moyenneGen(BigDecimal.valueOf(moyenne.getValeur()))
                .statut(moyenne.isAdmis() ? "ADMIS" : "AJOURNÉ")
                .build();

        return ReleveResponse.from(releveRepository.save(releve));
    }

    public List<ReleveResponse> findByEtudiant(Long etudiantId) {
        return releveRepository.findByEtudiantId(etudiantId)
                .stream()
                .map(ReleveResponse::from)
                .toList();
    }

    public List<ReleveResponse> findByClasse(Long classeId) {
        return releveRepository.findByClasseId(classeId)
                .stream()
                .map(ReleveResponse::from)
                .toList();
    }

    public byte[] exportPdf(Long releveId) {
        Releve releve = releveRepository.findById(releveId)
                .orElseThrow(() -> new ResourceNotFoundException("Relevé introuvable : " + releveId));
        try {
            return pdfGeneratorService.generateReleve(releve);
        } catch (Exception e) {
            throw new BusinessException("Erreur génération PDF : " + e.getMessage());
        }
    }

    public byte[] exportExcel(Long classeId) {
        try {
            return excelExportService.exportNotesClasse(classeId);
        } catch (Exception e) {
            throw new BusinessException("Erreur génération Excel : " + e.getMessage());
        }
    }
}