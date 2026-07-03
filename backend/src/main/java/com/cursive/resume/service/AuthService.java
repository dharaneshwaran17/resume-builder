package com.cursive.resume.service;

import com.cursive.resume.dto.AuthDtos.*;
import com.cursive.resume.entity.User;
import com.cursive.resume.exception.ApiException;
import com.cursive.resume.repository.UserRepository;
import com.cursive.resume.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }

    @Transactional
    public AuthResponse signup(SignupRequest req) {
        if (users.existsByEmailIgnoreCase(req.email())) {
            throw ApiException.conflict("Email already registered");
        }
        User u = User.builder()
            .name(req.name())
            .email(req.email())
            .passwordHash(encoder.encode(req.password()))
            .role(User.Role.USER)
            .build();
        users.save(u);
        return toAuthResponse(u);
    }

    public AuthResponse login(LoginRequest req) {
        User u = users.findByEmailIgnoreCase(req.email())
            .orElseThrow(() -> ApiException.unauthorized("Invalid credentials"));
        if (!encoder.matches(req.password(), u.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid credentials");
        }
        return toAuthResponse(u);
    }

    private AuthResponse toAuthResponse(User u) {
        String token = jwt.issue(u.getId(), u.getRole().name());
        return new AuthResponse(token, new UserView(
            u.getId(), u.getName(), u.getEmail(), u.getRole().name(),
            u.getCreatedAt().toString()
        ));
    }
}
