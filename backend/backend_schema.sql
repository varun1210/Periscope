-- This script drops all existing objects and recreates them

-- Drop all tables if they exist
DROP TABLE IF EXISTS user_job_saves CASCADE;
DROP TABLE IF EXISTS user_job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create Users table (GitHub OAuth version)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    github_id VARCHAR(50) UNIQUE NOT NULL,
    github_username VARCHAR(100) NOT NULL,
    github_access_token VARCHAR(255) NOT NULL,
    github_refresh_token VARCHAR(255) NOT NULL,
    github_token_expires_at TIMESTAMP NOT NULL,
    github_refresh_token_expires_at TIMESTAMP NOT NULL,
    name VARCHAR(200),
    email VARCHAR(255),
    avatar_url VARCHAR(500),
    bio TEXT,
    location VARCHAR(200),
    hireable BOOLEAN,
    phone VARCHAR(20),
    resume_paths TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Jobs table
CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    state VARCHAR(100),
    job_description TEXT,
    median_pay DECIMAL(10,2),
    min_pay DECIMAL(10,2),
    max_pay DECIMAL(10,2),
    industry VARCHAR(100),
    experience VARCHAR(50),
    link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User Job Applications table
CREATE TABLE user_job_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(job_id) ON DELETE CASCADE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'applied',
    UNIQUE(user_id, job_id)
);

-- Create User Job Saves table
CREATE TABLE user_job_saves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(job_id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- Create indexes for better query performance

-- Jobs table indexes
CREATE INDEX idx_jobs_industry ON jobs(industry) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_location ON jobs(location) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_state ON jobs(state) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_experience ON jobs(experience) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date DESC) WHERE is_active = TRUE;

-- Full-text search index for jobs
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || company || ' ' || COALESCE(job_description, ''))) WHERE is_active = TRUE;

-- User interactions indexes
CREATE INDEX idx_user_applications_user_id ON user_job_applications(user_id);
CREATE INDEX idx_user_applications_job_id ON user_job_applications(job_id);
CREATE INDEX idx_user_saves_user_id ON user_job_saves(user_id);
CREATE INDEX idx_user_saves_job_id ON user_job_saves(job_id);

-- Users table indexes (GitHub OAuth version)
CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_email ON users(email) WHERE is_active = TRUE AND email IS NOT NULL;

-- Add update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();