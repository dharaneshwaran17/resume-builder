package com.cursive.resume.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;

public class ResumeDtos {

    public record PersonalInfo(
        String fullName, String title, String email, String phone, String location,
        String linkedin, String github, String portfolio, String photo, String summary
    ) {}

    public record EducationItem(String id, String institution, String degree, String department, String cgpa, String year) {}
    public record ExperienceItem(String id, String company, String role, String duration, String description) {}
    public record ProjectItem(String id, String name, String description, String tech, String github, String live) {}
    public record CertificateItem(String id, String name, String issuer, String year) {}

    public record ResumeView(
        String id,
        String name,
        String template,
        String accent,
        String createdAt,
        String updatedAt,
        Integer downloads,
        PersonalInfo personal,
        List<EducationItem> education,
        List<ExperienceItem> experience,
        List<ProjectItem> projects,
        Map<String, List<String>> skills,
        List<CertificateItem> certificates
    ) {}

    public record ResumeUpsertRequest(
        @NotBlank @Size(max = 200) String name,
        @NotBlank String template,
        @NotBlank String accent,
        PersonalInfo personal,
        List<EducationItem> education,
        List<ExperienceItem> experience,
        List<ProjectItem> projects,
        Map<String, List<String>> skills,
        List<CertificateItem> certificates
    ) {}
}
