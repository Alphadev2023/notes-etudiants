package com.gestion.notes_backend.identity.application;

import com.gestion.notes_backend.identity.application.dto.*;
import com.gestion.notes_backend.identity.domain.Role;
import com.gestion.notes_backend.identity.domain.User;
import com.gestion.notes_backend.identity.domain.UserRepository;
import com.gestion.notes_backend.shared.exceptions.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        String accessToken  = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new LoginResponse(accessToken, refreshToken, UserDto.from(user));
    }

    @Transactional
    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email déjà utilisé");
        }

        Role role = switch (request.role() != null ? request.role().toUpperCase() : "ETUDIANT") {
            case "ADMIN"      -> Role.ROLE_ADMIN;
            case "ENSEIGNANT" -> Role.ROLE_ENSEIGNANT;
            default           -> Role.ROLE_ETUDIANT;
        };

        User user = User.builder()
                .nom(request.nom())
                .prenom(request.prenom())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .roles(Set.of(role))
                .build();

        return UserDto.from(userRepository.save(user));
    }
}