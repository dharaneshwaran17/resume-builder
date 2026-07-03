package com.cursive.resume.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity @Table(name = "experience")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Experience {
    @Id @Column(length = 36) private String id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "resume_id") private Resume resume;
    @Column(name = "sort_order") private Integer sortOrder;
    private String company;
    private String role;
    private String duration;
    @Lob private String description;
    @PrePersist void gen() { if (id == null) id = UUID.randomUUID().toString(); }
}
