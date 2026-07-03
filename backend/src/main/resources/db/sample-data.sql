-- Demo seed data. BCrypt hash below is for password "admin123".
USE cursive;

INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin', 'admin@cursive.app',
   '$2a$10$7EqJtq98hPqEX7fNZaFWoOa8kX3Q6dS2K.mR8f0G2m3F5H8bJcHnO', 'ADMIN'),
  ('00000000-0000-0000-0000-000000000002', 'Elias Vanderbilt', 'elias@vanderbilt.com',
   '$2a$10$7EqJtq98hPqEX7fNZaFWoOa8kX3Q6dS2K.mR8f0G2m3F5H8bJcHnO', 'USER');

INSERT INTO resumes (id, user_id, name, template, accent, full_name, title, email, phone, location, summary, downloads)
VALUES ('10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        'Elias — Product Designer 2024',
        'classic', '#1c1917',
        'Elias Vanderbilt', 'Senior Product Designer',
        'elias@vanderbilt.com', '+1 415 555 0192', 'San Francisco, CA',
        'Multidisciplinary designer with 8 years experience.', 12);

INSERT INTO experience (id, resume_id, sort_order, company, role, duration, description) VALUES
  ('e1000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 0,
   'Linear', 'Lead Designer', '2021 — Present',
   'Driving visual direction for the core issue tracking experience.');
