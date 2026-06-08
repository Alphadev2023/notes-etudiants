package com.gestion.notes_backend.notification;

import com.gestion.notes_backend.notification.dto.NotificationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;
    private final SimpMessagingTemplate messagingTemplate;

    public void envoyerEmail(String destinataire, String sujet, String contenu) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(destinataire);
            message.setSubject(sujet);
            message.setText(contenu);
            mailSender.send(message);
            log.info("Email envoyé à {}", destinataire);
        } catch (Exception e) {
            log.error("Erreur envoi email à {} : {}", destinataire, e.getMessage());
        }
    }

    public void envoyerNotificationTempsReel(Long userId, NotificationDto notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    notification
            );
            log.info("Notification WebSocket envoyée à l'utilisateur {}", userId);
        } catch (Exception e) {
            log.error("Erreur notification WebSocket : {}", e.getMessage());
        }
    }

    public void notifierNouvelleNote(String emailEtudiant, Long etudiantId,
                                     String matiere, double valeur) {
        // Email
        envoyerEmail(
                emailEtudiant,
                "Nouvelle note disponible",
                String.format("Une nouvelle note a été saisie.\nMatière : %s\nNote : %.2f/20",
                        matiere, valeur)
        );

        // WebSocket temps réel
        NotificationDto notification = NotificationDto.builder()
                .type("NOUVELLE_NOTE")
                .message(String.format("Note %.2f/20 en %s", valeur, matiere))
                .destinataireId(etudiantId)
                .build();

        envoyerNotificationTempsReel(etudiantId, notification);
    }
}