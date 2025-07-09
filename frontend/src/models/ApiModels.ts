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

export type QueryType = "Title" | "Location" | "Industry"

export interface QueryResponse {
    results: string[]
}

interface JobSummaryResponse {
    job_id: number,
    company: string, 
    title: string,
    location: string,
    median_pay: number | null,
    min_pay: number | null,
    max_pay: number | null,
    link: string
}

export type FiltersRequest = {
    industry: string[] | null,
    experience: string[] | null,
    location: string[] | null,
    resume: string | null
}

export interface JobSearchResponse {
    jobs: JobSummaryResponse[],
    total: number,
    page: number,
    limit: number, 
    total_pages: number
}

export interface JobResponse {
    job_id: number,
    company: string,
    title: string,
    location: string,
    state: string,
    job_description: string | null,
    median_pay: number | null,
    min_pay: number | null,
    max_pay: number | null,
    industry: string | null,
    experience: string | null,
    link: string | null
}