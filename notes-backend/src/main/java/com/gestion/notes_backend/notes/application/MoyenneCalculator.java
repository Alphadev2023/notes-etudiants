package com.gestion.notes_backend.notes.application;

import com.gestion.notes_backend.matieres.domain.Matiere;
import com.gestion.notes_backend.matieres.domain.MatiereRepository;
import com.gestion.notes_backend.notes.domain.Moyenne;
import com.gestion.notes_backend.notes.domain.Note;
import com.gestion.notes_backend.notes.domain.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MoyenneCalculator {

    private final NoteRepository noteRepository;
    private final MatiereRepository matiereRepository;

    public Moyenne calculerMoyenneEtudiant(Long etudiantId, Long classeId) {
        List<Matiere> matieres = matiereRepository.findByClasseId(classeId);

        double somme = 0;
        double coeffTotal = 0;
        int totalNotes = 0;

        for (Matiere matiere : matieres) {
            List<Note> notes = noteRepository.findByEtudiantIdAndMatiereId(etudiantId, matiere.getId());
            if (!notes.isEmpty()) {
                double moyMatiere = notes.stream()
                        .mapToDouble(n -> n.getValeur().doubleValue())
                        .average()
                        .orElse(0);
                double coeff = matiere.getCoefficient().getDoubleValue();
                somme += moyMatiere * coeff;
                coeffTotal += coeff;
                totalNotes += notes.size();
            }
        }

        double moyenneGen = coeffTotal > 0 ? somme / coeffTotal : 0;
        return Moyenne.of(
                Math.round(moyenneGen * 100.0) / 100.0,
                totalNotes,
                coeffTotal
        );
    }

    public double calculerMoyenneMatiere(Long matiereId, Long classeId) {
        List<Note> notes = noteRepository.findByMatiereId(matiereId);
        return notes.stream()
                .mapToDouble(n -> n.getValeur().doubleValue())
                .average()
                .orElse(0);
    }
}