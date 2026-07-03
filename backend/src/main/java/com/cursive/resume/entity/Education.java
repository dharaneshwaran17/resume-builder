package com.cursive.resume.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity @Table(name = "education")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Education {
    @Id @Column(length = 36) private String id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "resume_id") private Resume resume;
    @Column(name = "sort_order") private Integer sortOrder;
    private String institution;
    private String degree;
    private String department;
    private String cgpa;
    private String year;
    @PrePersist void gen() { if (id == null) id = UUID.randomUUID().toString(); }
}
