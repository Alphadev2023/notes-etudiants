package com.gestion.notes_backend.identity.infrastructure;

import com.gestion.notes_backend.identity.domain.User;
import com.gestion.notes_backend.identity.domain.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaUserRepository extends JpaRepository<User, Long>, UserRepository {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}