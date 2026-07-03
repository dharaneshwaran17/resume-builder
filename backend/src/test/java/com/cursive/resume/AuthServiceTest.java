package com.cursive.resume.service;

import com.cursive.resume.dto.AuthDtos.LoginRequest;
import com.cursive.resume.dto.AuthDtos.SignupRequest;
import com.cursive.resume.entity.User;
import com.cursive.resume.exception.ApiException;
import com.cursive.resume.repository.UserRepository;
import com.cursive.resume.security.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Test
    void signup_rejects_duplicate_email() {
        UserRepository users = Mockito.mock(UserRepository.class);
        PasswordEncoder enc = Mockito.mock(PasswordEncoder.class);
        JwtService jwt = Mockito.mock(JwtService.class);
        when(users.existsByEmailIgnoreCase("a@b.c")).thenReturn(true);

        AuthService svc = new AuthService(users, enc, jwt);
        assertThrows(ApiException.class,
            () -> svc.signup(new SignupRequest("A", "a@b.c", "secret123")));
    }

    @Test
    void login_rejects_bad_password() {
        UserRepository users = Mockito.mock(UserRepository.class);
        PasswordEncoder enc = Mockito.mock(PasswordEncoder.class);
        JwtService jwt = Mockito.mock(JwtService.class);
        User u = User.builder().id("1").email("a@b.c").passwordHash("hash").role(User.Role.USER).build();
        u.setCreatedAt(Instant.now());
        when(users.findByEmailIgnoreCase("a@b.c")).thenReturn(Optional.of(u));
        when(enc.matches(any(), any())).thenReturn(false);

        AuthService svc = new AuthService(users, enc, jwt);
        assertThrows(ApiException.class,
            () -> svc.login(new LoginRequest("a@b.c", "wrong")));
    }
}
