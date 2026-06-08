package com.gestion.notes_backend.releves.application;

import com.gestion.notes_backend.identity.domain.User;
import com.gestion.notes_backend.identity.domain.UserRepository;
import com.gestion.notes_backend.matieres.domain.Matiere;
import com.gestion.notes_backend.matieres.domain.MatiereRepository;
import com.gestion.notes_backend.notes.domain.Note;
import com.gestion.notes_backend.notes.domain.NoteRepository;
import com.gestion.notes_backend.releves.domain.Releve;
import com.gestion.notes_backend.shared.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfGeneratorService {

    private final UserRepository userRepository;
    private final MatiereRepository matiereRepository;
    private final NoteRepository noteRepository;

    public byte[] generateReleve(Releve releve) throws IOException {
        User etudiant = userRepository.findByEmail(
                userRepository.findByEmail("etudiant@notes.com")
                        .map(User::getEmail).orElse("")
        ).orElseThrow(() -> new ResourceNotFoundException("Étudiant introuvable"));

        List<Matiere> matieres = matiereRepository.findByClasseId(releve.getClasseId());

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDType1Font fontBold    = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {

                // ── En-tête ──
                cs.beginText();
                cs.setFont(fontBold, 18);
                cs.newLineAtOffset(180, 780);
                cs.showText("RELEVÉ DE NOTES");
                cs.endText();

                cs.beginText();
                cs.setFont(fontBold, 12);
                cs.newLineAtOffset(50, 740);
                cs.showText("Système de Gestion des Notes Étudiantes");
                cs.endText();

                // ── Infos étudiant ──
                cs.beginText();
                cs.setFont(fontRegular, 11);
                cs.newLineAtOffset(50, 700);
                cs.showText("Étudiant : " + etudiant.getNomComplet());
                cs.newLineAtOffset(0, -18);
                cs.showText("Email    : " + etudiant.getEmail());
                cs.newLineAtOffset(0, -18);
                cs.showText("Semestre : " + releve.getSemestre());
                cs.newLineAtOffset(0, -18);
                cs.showText("Année    : " + releve.getAnnee());
                cs.endText();

                // ── Ligne de séparation ──
                cs.moveTo(50, 635);
                cs.lineTo(545, 635);
                cs.stroke();

                // ── En-têtes tableau ──
                cs.beginText();
                cs.setFont(fontBold, 11);
                cs.newLineAtOffset(50, 615);
                cs.showText("Matière");
                cs.newLineAtOffset(280, 0);
                cs.showText("Coeff.");
                cs.newLineAtOffset(60, 0);
                cs.showText("Note");
                cs.endText();

                cs.moveTo(50, 605);
                cs.lineTo(545, 605);
                cs.stroke();

                // ── Lignes notes ──
                float y = 585;
                for (Matiere matiere : matieres) {
                    List<Note> notes = noteRepository
                            .findByEtudiantIdAndMatiereId(releve.getEtudiantId(), matiere.getId());

                    double valeur = notes.isEmpty() ? 0 :
                            notes.stream().mapToDouble(n -> n.getValeur().doubleValue()).average().orElse(0);

                    cs.beginText();
                    cs.setFont(fontRegular, 10);
                    cs.newLineAtOffset(50, y);
                    cs.showText(matiere.getNom());
                    cs.newLineAtOffset(280, 0);
                    cs.showText(String.valueOf(matiere.getCoefficient().getValeur()));
                    cs.newLineAtOffset(60, 0);
                    cs.showText(String.format("%.2f", valeur));
                    cs.endText();
                    y -= 20;
                }

                // ── Moyenne générale ──
                cs.moveTo(50, y - 5);
                cs.lineTo(545, y - 5);
                cs.stroke();

                cs.beginText();
                cs.setFont(fontBold, 12);
                cs.newLineAtOffset(50, y - 25);
                cs.showText("Moyenne Générale : " +
                        String.format("%.2f", releve.getMoyenneGen() != null ?
                                releve.getMoyenneGen().doubleValue() : 0));
                cs.newLineAtOffset(250, 0);
                cs.showText("Statut : " + releve.getStatut());
                cs.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }
}