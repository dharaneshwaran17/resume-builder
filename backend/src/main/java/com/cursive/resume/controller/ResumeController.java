package com.cursive.resume.controller;

import com.cursive.resume.dto.ResumeDtos.*;
import com.cursive.resume.service.ResumeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumes;

    public ResumeController(ResumeService resumes) { this.resumes = resumes; }

    @GetMapping public List<ResumeView> list() { return resumes.listMine(); }

    @PostMapping public ResumeView create(@RequestBody @Valid ResumeUpsertRequest req) { return resumes.create(req); }

    @GetMapping("/{id}") public ResumeView get(@PathVariable String id) { return resumes.get(id); }

    @PutMapping("/{id}")
    public ResumeView update(@PathVariable String id, @RequestBody @Valid ResumeUpsertRequest req) {
        return resumes.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        resumes.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/duplicate")
    public ResumeView duplicate(@PathVariable String id) { return resumes.duplicate(id); }

    @PostMapping("/{id}/download")
    public ResponseEntity<?> download(@PathVariable String id) {
        resumes.incrementDownloads(id);
        return ResponseEntity.ok().build();
    }
}
