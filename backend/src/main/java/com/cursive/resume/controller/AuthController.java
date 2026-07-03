package com.cursive.resume.controller;

import com.cursive.resume.dto.AuthDtos.*;
import com.cursive.resume.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) { this.auth = auth; }

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody @Valid SignupRequest req) { return auth.signup(req); }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid LoginRequest req) { return auth.login(req); }

    /** In a real deployment, email the reset token. Here we just 200. */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@RequestBody @Valid ForgotRequest req) {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@RequestBody @Valid ResetRequest req) {
        // Full flow left as an exercise; wire to PasswordReset entity.
        return ResponseEntity.ok().build();
    }
}
