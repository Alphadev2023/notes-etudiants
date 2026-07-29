package com.gestion.notes_backend.identity.domain;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    Optional<User> findUserById(Long id);
    User save(User user);
    boolean existsByEmail(String email);
}