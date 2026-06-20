package com.gestion.notes_backend.identity.application;

import com.gestion.notes_backend.identity.application.dto.UserDto;
import com.gestion.notes_backend.identity.domain.UserRepository;
import com.gestion.notes_backend.identity.infrastructure.JpaUserRepository;
import com.gestion.notes_backend.shared.exceptions.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDto findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserDto::from)
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));
    }

    public List<UserDto> findAll() {
        return ((JpaUserRepository) userRepository).findAll()
                .stream()
                .map(UserDto::from)
                .toList();
    }

    public UserDto findById(Long id) {
        return ((JpaUserRepository) userRepository).findById(id)
                .map(UserDto::from)
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));
    }
}