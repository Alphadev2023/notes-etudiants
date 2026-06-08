package com.gestion.notes_backend.notification;

import com.gestion.notes_backend.identity.domain.User;
import com.gestion.notes_backend.identity.domain.UserRepository;
import com.gestion.notes_backend.matieres.domain.Matiere;
import com.gestion.notes_backend.matieres.domain.MatiereRepository;
import com.gestion.notes_backend.notes.domain.NoteCreatedEvent;
import com.gestion.notes_backend.shared.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final MatiereRepository matiereRepository;

    @ApplicationModuleListener
    public void onNoteCreated(NoteCreatedEvent event) {
        try {
            User etudiant = userRepository.findByEmail(
                    userRepository.findByEmail("etudiant@notes.com")
                            .map(User::getEmail)
                            .orElseThrow(() -> new ResourceNotFoundException("Étudiant introuvable"))
            ).orElseThrow(() -> new ResourceNotFoundException("Étudiant introuvable"));

            Matiere matiere = matiereRepository.findById(event.matiereId())
                    .orElseThrow(() -> new ResourceNotFoundException("Matière introuvable"));

            notificationService.notifierNouvelleNote(
                    etudiant.getEmail(),
                    etudiant.getId(),
                    matiere.getNom(),
                    event.valeur()
            );

            log.info("Notification envoyée pour note {} - étudiant {}",
                    event.noteId(), event.etudiantId());

        } catch (Exception e) {
            log.error("Erreur traitement NoteCreatedEvent : {}", e.getMessage());
        }
    }
}