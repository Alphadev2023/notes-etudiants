package com.gestion.notes_backend.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    private String type;
    private String message;
    private Long destinataireId;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}