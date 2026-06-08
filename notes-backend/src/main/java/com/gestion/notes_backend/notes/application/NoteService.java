package com.gestion.notes_backend.notes.application;

import com.gestion.notes_backend.notes.application.dto.MoyenneResponse;
import com.gestion.notes_backend.notes.application.dto.NoteRequest;
import com.gestion.notes_backend.notes.application.dto.NoteResponse;
import com.gestion.notes_backend.notes.domain.Note;
import com.gestion.notes_backend.notes.domain.NoteCreatedEvent;
import com.gestion.notes_backend.notes.domain.NoteRepository;
import com.gestion.notes_backend.shared.exceptions.BusinessException;
import com.gestion.notes_backend.shared.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final MoyenneCalculator moyenneCalculator;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public NoteResponse create(NoteRequest request, Long enseignantId) {
        if (noteRepository.existsByEtudiantIdAndMatiereIdAndTypeNote(
                request.etudiantId(), request.matiereId(), request.typeNote())) {
            throw new BusinessException("Une note de ce type existe déjà pour cet étudiant dans cette matière");
        }

        Note note = Note.builder()
                .valeur(request.valeur())
                .typeNote(request.typeNote().toUpperCase())
                .commentaire(request.commentaire())
                .etudiantId(request.etudiantId())
                .matiereId(request.matiereId())
                .enseignantId(enseignantId)
                .build();

        Note saved = noteRepository.save(note);

        eventPublisher.publishEvent(new NoteCreatedEvent(
                saved.getId(),
                saved.getEtudiantId(),
                saved.getMatiereId(),
                saved.getValeur().doubleValue()
        ));

        return NoteResponse.from(saved);
    }

    public List<NoteResponse> findByEtudiant(Long etudiantId) {
        return noteRepository.findByEtudiantId(etudiantId)
                .stream()
                .map(NoteResponse::from)
                .toList();
    }

    public List<NoteResponse> findByEnseignant(Long enseignantId) {
        return noteRepository.findByEnseignantId(enseignantId)
                .stream()
                .map(NoteResponse::from)
                .toList();
    }

    public MoyenneResponse calculerMoyenne(Long etudiantId, Long classeId) {
        return MoyenneResponse.from(
                moyenneCalculator.calculerMoyenneEtudiant(etudiantId, classeId)
        );
    }

    @Transactional
    public NoteResponse update(Long id, NoteRequest request, Long enseignantId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note introuvable : " + id));
        note.setValeur(request.valeur());
        note.setCommentaire(request.commentaire());
        note.setUpdatedAt(LocalDateTime.now());
        return NoteResponse.from(noteRepository.save(note));
    }

    @Transactional
    public void delete(Long id) {
        if (noteRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Note introuvable : " + id);
        }
        noteRepository.deleteById(id);
    }
}