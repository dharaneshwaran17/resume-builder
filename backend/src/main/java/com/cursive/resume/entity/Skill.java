package com.cursive.resume.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity @Table(name = "skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Skill {
    @Id @Column(length = 36) private String id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "resume_id") private Resume resume;
    /** languages | frontend | backend | databases | tools | soft */
    @Column(nullable = false, length = 50) private String category;
    @Column(nullable = false, length = 120) private String value;
    @PrePersist void gen() { if (id == null) id = UUID.randomUUID().toString(); }
}
