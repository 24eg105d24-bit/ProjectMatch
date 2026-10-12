-- =============================================================================
-- ProjectMatch V1 Initial Schema Migration
-- Compatible with MySQL 8+ (InnoDB) and H2 (MySQL Mode)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM ('ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT') NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
);

-- -----------------------------------------------------------------------------
-- 2. Student Profiles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    headline VARCHAR(200) NULL,
    university VARCHAR(150) NULL,
    department VARCHAR(150) NULL,
    academic_year VARCHAR(50) NULL,
    gpa DOUBLE NULL,
    bio TEXT NULL,
    avatar_url VARCHAR(500) NULL,
    hours_per_week INT NOT NULL,
    preferred_time VARCHAR(150) NULL,
    timezone VARCHAR(50) NULL,
    availability_status ENUM ('ACTIVELY_LOOKING', 'NOT_AVAILABLE', 'OPEN_TO_COLLABORATION') NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_student_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_student_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_preferred_roles (
    student_profile_id BIGINT NOT NULL,
    role_name VARCHAR(100) NULL,
    CONSTRAINT fk_student_preferred_roles_profile FOREIGN KEY (student_profile_id) REFERENCES student_profiles (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_interests (
    student_profile_id BIGINT NOT NULL,
    interest_name VARCHAR(100) NULL,
    CONSTRAINT fk_student_interests_profile FOREIGN KEY (student_profile_id) REFERENCES student_profiles (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 3. Skills
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_skills_name UNIQUE (name)
);

-- -----------------------------------------------------------------------------
-- 4. Student Skills
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_skills (
    id BIGINT NOT NULL AUTO_INCREMENT,
    student_profile_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency ENUM ('ADVANCED', 'BEGINNER', 'INTERMEDIATE') NOT NULL,
    years_of_experience DOUBLE NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_student_skills_profile_skill UNIQUE (student_profile_id, skill_id),
    CONSTRAINT fk_student_skills_profile FOREIGN KEY (student_profile_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_student_skills_skill FOREIGN KEY (skill_id) REFERENCES skills (id)
);

-- -----------------------------------------------------------------------------
-- 5. Projects
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    tagline VARCHAR(300) NULL,
    description TEXT NULL,
    category VARCHAR(100) NOT NULL,
    status ENUM ('COMPLETED', 'IN_PROGRESS', 'RECRUITING') NOT NULL,
    creator_user_id BIGINT NOT NULL,
    max_team_size INT NOT NULL,
    academic_term VARCHAR(100) NULL,
    deadline VARCHAR(150) NULL,
    weekly_hours_expectation INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_projects_creator FOREIGN KEY (creator_user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS project_open_roles (
    project_id BIGINT NOT NULL,
    role_name VARCHAR(100) NULL,
    CONSTRAINT fk_project_open_roles_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_tags (
    project_id BIGINT NOT NULL,
    tag_name VARCHAR(50) NULL,
    CONSTRAINT fk_project_tags_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 6. Project Skills
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_skills (
    id BIGINT NOT NULL AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    min_proficiency ENUM ('ADVANCED', 'BEGINNER', 'INTERMEDIATE') NOT NULL,
    is_required BIT(1) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_project_skills_project_skill UNIQUE (project_id, skill_id),
    CONSTRAINT fk_project_skills_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT fk_project_skills_skill FOREIGN KEY (skill_id) REFERENCES skills (id)
);

-- -----------------------------------------------------------------------------
-- 7. Teams
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    project_id BIGINT NOT NULL,
    faculty_advisor VARCHAR(150) NULL,
    meeting_schedule VARCHAR(200) NULL,
    repository_url VARCHAR(300) NULL,
    communication_channel VARCHAR(100) NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_teams_project UNIQUE (project_id),
    CONSTRAINT fk_teams_project FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------------------------------
-- 8. Team Members
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_members (
    id BIGINT NOT NULL AUTO_INCREMENT,
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    member_role ENUM ('LEADER', 'MEMBER') NOT NULL,
    assigned_role_name VARCHAR(100) NULL,
    joined_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_team_members_team_user UNIQUE (team_id, user_id),
    CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams (id),
    CONSTRAINT fk_team_members_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- -----------------------------------------------------------------------------
-- 9. Tasks
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT NOT NULL AUTO_INCREMENT,
    team_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    status ENUM ('DONE', 'IN_PROGRESS', 'REVIEW', 'TODO') NOT NULL,
    priority ENUM ('HIGH', 'LOW', 'MEDIUM') NOT NULL,
    tag VARCHAR(50) NULL,
    due_date VARCHAR(100) NULL,
    assignee_user_id BIGINT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_tasks_team FOREIGN KEY (team_id) REFERENCES teams (id),
    CONSTRAINT fk_tasks_assignee FOREIGN KEY (assignee_user_id) REFERENCES users (id)
);

-- -----------------------------------------------------------------------------
-- 10. Invitations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invitations (
    id BIGINT NOT NULL AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    team_id BIGINT NULL,
    sender_user_id BIGINT NOT NULL,
    receiver_user_id BIGINT NOT NULL,
    target_role VARCHAR(100) NULL,
    message VARCHAR(1000) NULL,
    status ENUM ('ACCEPTED', 'PENDING', 'REJECTED') NOT NULL,
    type ENUM ('JOIN_REQUEST', 'TEAM_INVITATION') NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_invitations_project FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT fk_invitations_team FOREIGN KEY (team_id) REFERENCES teams (id),
    CONSTRAINT fk_invitations_sender FOREIGN KEY (sender_user_id) REFERENCES users (id),
    CONSTRAINT fk_invitations_receiver FOREIGN KEY (receiver_user_id) REFERENCES users (id)
);
