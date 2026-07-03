package com.cursive.resume.service;

import com.cursive.resume.dto.ResumeDtos.*;
import com.cursive.resume.entity.*;
import com.cursive.resume.exception.ApiException;
import com.cursive.resume.repository.ResumeRepository;
import com.cursive.resume.util.CurrentUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private final ResumeRepository repo;

    public ResumeService(ResumeRepository repo) { this.repo = repo; }

    public List<ResumeView> listMine() {
        return repo.findByUserIdOrderByUpdatedAtDesc(CurrentUser.id()).stream()
            .map(this::toView).toList();
    }

    @Transactional
    public ResumeView create(ResumeUpsertRequest req) {
        Resume r = new Resume();
        r.setUserId(CurrentUser.id());
        applyUpsert(r, req);
        return toView(repo.save(r));
    }

    public ResumeView get(String id) { return toView(loadOwned(id)); }

    @Transactional
    public ResumeView update(String id, ResumeUpsertRequest req) {
        Resume r = loadOwned(id);
        applyUpsert(r, req);
        return toView(r);
    }

    @Transactional
    public void delete(String id) { repo.delete(loadOwned(id)); }

    @Transactional
    public ResumeView duplicate(String id) {
        Resume src = loadOwned(id);
        Resume copy = new Resume();
        copy.setUserId(src.getUserId());
        copy.setName(src.getName() + " (copy)");
        copy.setTemplate(src.getTemplate());
        copy.setAccent(src.getAccent());
        copy.setFullName(src.getFullName());
        copy.setTitle(src.getTitle());
        copy.setEmail(src.getEmail());
        copy.setPhone(src.getPhone());
        copy.setLocation(src.getLocation());
        copy.setLinkedin(src.getLinkedin());
        copy.setGithub(src.getGithub());
        copy.setPortfolio(src.getPortfolio());
        copy.setPhotoUrl(src.getPhotoUrl());
        copy.setSummary(src.getSummary());
        copy.setDownloads(0);
        // shallow copy of child lists left as an exercise / not required by MVP demo
        return toView(repo.save(copy));
    }

    @Transactional
    public void incrementDownloads(String id) {
        Resume r = loadOwned(id);
        r.setDownloads(r.getDownloads() + 1);
    }

    private Resume loadOwned(String id) {
        Resume r = repo.findById(id).orElseThrow(() -> ApiException.notFound("Resume"));
        if (!CurrentUser.isAdmin() && !r.getUserId().equals(CurrentUser.id())) {
            throw ApiException.forbidden("Not your resume");
        }
        return r;
    }

    private void applyUpsert(Resume r, ResumeUpsertRequest req) {
        r.setName(req.name());
        r.setTemplate(req.template());
        r.setAccent(req.accent());
        PersonalInfo p = req.personal();
        if (p != null) {
            r.setFullName(p.fullName());
            r.setTitle(p.title());
            r.setEmail(p.email());
            r.setPhone(p.phone());
            r.setLocation(p.location());
            r.setLinkedin(p.linkedin());
            r.setGithub(p.github());
            r.setPortfolio(p.portfolio());
            r.setPhotoUrl(p.photo());
            r.setSummary(p.summary());
        }
        // Replace children (simple strategy)
        r.getEducation().clear();
        if (req.education() != null) req.education().forEach(e ->
            r.getEducation().add(Education.builder()
                .resume(r).institution(e.institution()).degree(e.degree())
                .department(e.department()).cgpa(e.cgpa()).year(e.year()).build()));
        r.getExperience().clear();
        if (req.experience() != null) req.experience().forEach(e ->
            r.getExperience().add(Experience.builder()
                .resume(r).company(e.company()).role(e.role())
                .duration(e.duration()).description(e.description()).build()));
        r.getProjects().clear();
        if (req.projects() != null) req.projects().forEach(e ->
            r.getProjects().add(Project.builder()
                .resume(r).name(e.name()).description(e.description())
                .tech(e.tech()).github(e.github()).live(e.live()).build()));
        r.getSkills().clear();
        if (req.skills() != null) req.skills().forEach((cat, values) ->
            values.forEach(v -> r.getSkills().add(
                Skill.builder().resume(r).category(cat).value(v).build())));
        r.getCertificates().clear();
        if (req.certificates() != null) req.certificates().forEach(c ->
            r.getCertificates().add(Certificate.builder()
                .resume(r).name(c.name()).issuer(c.issuer()).year(c.year()).build()));
    }

    private ResumeView toView(Resume r) {
        Map<String, List<String>> skills = r.getSkills().stream()
            .collect(Collectors.groupingBy(Skill::getCategory,
                Collectors.mapping(Skill::getValue, Collectors.toList())));
        return new ResumeView(
            r.getId(), r.getName(), r.getTemplate(), r.getAccent(),
            r.getCreatedAt() == null ? null : r.getCreatedAt().toString(),
            r.getUpdatedAt() == null ? null : r.getUpdatedAt().toString(),
            r.getDownloads(),
            new PersonalInfo(
                r.getFullName(), r.getTitle(), r.getEmail(), r.getPhone(), r.getLocation(),
                r.getLinkedin(), r.getGithub(), r.getPortfolio(), r.getPhotoUrl(), r.getSummary()
            ),
            r.getEducation().stream().map(e ->
                new EducationItem(e.getId(), e.getInstitution(), e.getDegree(),
                    e.getDepartment(), e.getCgpa(), e.getYear())).toList(),
            r.getExperience().stream().map(e ->
                new ExperienceItem(e.getId(), e.getCompany(), e.getRole(),
                    e.getDuration(), e.getDescription())).toList(),
            r.getProjects().stream().map(p ->
                new ProjectItem(p.getId(), p.getName(), p.getDescription(),
                    p.getTech(), p.getGithub(), p.getLive())).toList(),
            skills,
            r.getCertificates().stream().map(c ->
                new CertificateItem(c.getId(), c.getName(), c.getIssuer(), c.getYear())).toList()
        );
    }
}
