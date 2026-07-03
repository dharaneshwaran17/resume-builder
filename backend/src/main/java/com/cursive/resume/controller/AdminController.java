package com.cursive.resume.controller;

import com.cursive.resume.dto.AuthDtos.UserView;
import com.cursive.resume.repository.ResumeRepository;
import com.cursive.resume.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository users;
    private final ResumeRepository resumes;

    public AdminController(UserRepository users, ResumeRepository resumes) {
        this.users = users; this.resumes = resumes;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        long userCount = users.count();
        long resumeCount = resumes.count();
        long downloads = resumes.findAll().stream().mapToLong(r -> r.getDownloads() == null ? 0 : r.getDownloads()).sum();
        Map<String, Long> byTemplate = new HashMap<>();
        for (Object[] row : resumes.countByTemplate()) {
            byTemplate.put((String) row[0], (Long) row[1]);
        }
        String topTemplate = byTemplate.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("classic");
        return Map.of(
            "userCount", userCount,
            "resumeCount", resumeCount,
            "totalDownloads", downloads,
            "topTemplate", topTemplate,
            "templateBreakdown", byTemplate
        );
    }

    @GetMapping("/users")
    public List<UserView> users() {
        return users.findAll().stream()
            .map(u -> new UserView(u.getId(), u.getName(), u.getEmail(),
                u.getRole().name(), u.getCreatedAt().toString()))
            .toList();
    }
}
