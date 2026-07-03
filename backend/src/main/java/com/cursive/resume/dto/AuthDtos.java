package com.cursive.resume.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public record SignupRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email @Size(max = 190) String email,
        @NotBlank @Size(min = 6, max = 100) String password
    ) {}
    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}
    public record ForgotRequest(@NotBlank @Email String email) {}
    public record ResetRequest(
        @NotBlank String token,
        @NotBlank @Size(min = 6, max = 100) String newPassword
    ) {}
    public record UserView(String id, String name, String email, String role, String createdAt) {}
    public record AuthResponse(String token, UserView user) {}
}
