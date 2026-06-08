package com.gestion.notes_backend.identity.application.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        UserDto user
) {
    public LoginResponse(String accessToken, String refreshToken, UserDto user) {
        this(accessToken, refreshToken, "Bearer", user);
    }
}