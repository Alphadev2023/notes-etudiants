package com.gestion.notes_backend.identity.application.dto;

import com.gestion.notes_backend.identity.domain.Role;
import com.gestion.notes_backend.identity.domain.User;

import java.util.Set;

public record UserDto(
        Long id,
        String nom,
        String prenom,
        String email,
        Set<Role> roles,
        boolean actif
) {
    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                user.getRoles(),
                user.isActif()
        );
    }
}