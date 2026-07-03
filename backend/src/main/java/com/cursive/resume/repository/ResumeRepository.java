package com.cursive.resume.repository;

import com.cursive.resume.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, String> {
    List<Resume> findByUserIdOrderByUpdatedAtDesc(String userId);

    @Query("select r.template, count(r) from Resume r group by r.template")
    List<Object[]> countByTemplate();
}
