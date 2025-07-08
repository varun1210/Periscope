import type JobSummary from './Job';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorResponse | null;
}

export interface ErrorResponse {
    status_code: number,
    content: {
        error: string,
        code: string
    }
}

export interface BackendAuthResponse {
    access_token: string,
    token_type: string
}

export interface UserProfileResponse {
    id: number,
    github_username: string,
    name: string | null,
    email: string | null,
    phone: string | null,
    resume_paths: string[]
}

export interface UserUpdateRequest {
    id: number | null,
    github_username: string | null, 
    name: string | null,
    email: string | null,
    phone: string | null,
    resume_paths: string[] | null,
    file: File | null
}

export interface AppliedJobsResponse {
    appliedJobs: JobSummary[]
}