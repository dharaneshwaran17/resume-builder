package com.cursive.resume.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity @Table(name = "projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {
    @Id @Column(length = 36) private String id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "resume_id") private Resume resume;
    @Column(name = "sort_order") private Integer sortOrder;
    private String name;
    @Lob private String description;
    private String tech;
    private String github;
    private String live;
    @PrePersist void gen() { if (id == null) id = UUID.randomUUID().toString(); }
}
