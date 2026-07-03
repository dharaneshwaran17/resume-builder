-- Cursive database schema (MySQL 8)

CREATE DATABASE IF NOT EXISTS cursive CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cursive;

CREATE TABLE IF NOT EXISTS users (
    id            CHAR(36)     NOT NULL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resumes (
    id            CHAR(36)     NOT NULL PRIMARY KEY,
    user_id       CHAR(36)     NOT NULL,
    name          VARCHAR(200) NOT NULL,
    template      VARCHAR(30)  NOT NULL DEFAULT 'classic',
    accent        VARCHAR(20)  NOT NULL DEFAULT '#1c1917',
    downloads     INT          NOT NULL DEFAULT 0,
    -- personal
    full_name     VARCHAR(200),
    title         VARCHAR(200),
    email         VARCHAR(200),
    phone         VARCHAR(50),
    location      VARCHAR(200),
    linkedin      VARCHAR(255),
    github        VARCHAR(255),
    portfolio     VARCHAR(255),
    photo_url     VARCHAR(500),
    summary       TEXT,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_resume_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_resume_user (user_id),
    INDEX idx_resume_template (template)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS education (
    id           CHAR(36)     NOT NULL PRIMARY KEY,
    resume_id    CHAR(36)     NOT NULL,
    sort_order   INT          NOT NULL DEFAULT 0,
    institution  VARCHAR(200),
    degree       VARCHAR(120),
    department   VARCHAR(120),
    cgpa         VARCHAR(20),
    year         VARCHAR(50),
    CONSTRAINT fk_edu_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS experience (
    id           CHAR(36)     NOT NULL PRIMARY KEY,
    resume_id    CHAR(36)     NOT NULL,
    sort_order   INT          NOT NULL DEFAULT 0,
    company      VARCHAR(200),
    role         VARCHAR(200),
    duration     VARCHAR(120),
    description  TEXT,
    CONSTRAINT fk_exp_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS projects (
    id           CHAR(36)     NOT NULL PRIMARY KEY,
    resume_id    CHAR(36)     NOT NULL,
    sort_order   INT          NOT NULL DEFAULT 0,
    name         VARCHAR(200),
    description  TEXT,
    tech         VARCHAR(500),
    github       VARCHAR(255),
    live         VARCHAR(255),
    CONSTRAINT fk_proj_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS skills (
    id           CHAR(36)     NOT NULL PRIMARY KEY,
    resume_id    CHAR(36)     NOT NULL,
    category     VARCHAR(50)  NOT NULL, -- languages|frontend|backend|databases|tools|soft
    value        VARCHAR(120) NOT NULL,
    CONSTRAINT fk_skill_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    INDEX idx_skill_resume (resume_id, category)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS certificates (
    id         CHAR(36)     NOT NULL PRIMARY KEY,
    resume_id  CHAR(36)     NOT NULL,
    name       VARCHAR(200),
    issuer     VARCHAR(200),
    year       VARCHAR(20),
    CONSTRAINT fk_cert_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS achievements (
    id         CHAR(36)     NOT NULL PRIMARY KEY,
    resume_id  CHAR(36)     NOT NULL,
    value      VARCHAR(500) NOT NULL,
    CONSTRAINT fk_ach_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS custom_sections (
    id         CHAR(36)     NOT NULL PRIMARY KEY,
    resume_id  CHAR(36)     NOT NULL,
    heading    VARCHAR(120) NOT NULL,
    body       TEXT,
    sort_order INT          NOT NULL DEFAULT 0,
    CONSTRAINT fk_custom_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_resets (
    token       VARCHAR(120) NOT NULL PRIMARY KEY,
    user_id     CHAR(36)     NOT NULL,
    expires_at  DATETIME     NOT NULL,
    CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
