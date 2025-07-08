import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { GITHUB_AUTH_URL, API_BASE_URL, AUTH_API_BASE_URL } from "./env";

import type {
  ApiResponse,
  AppliedJobsResponse,
  BackendAuthResponse,
  ErrorResponse,
  UserProfileResponse,
  UserUpdateRequest,
} from "./models/ApiModels";

let currentAccessToken: string | null = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  githubLogin: () => {
    window.location.href = GITHUB_AUTH_URL;
  },

  login: async (code: string): Promise<ApiResponse<BackendAuthResponse>> => {
    try {
      const response = await authApi.post("login", { code });
      const authData: BackendAuthResponse = response.data;
      currentAccessToken = authData.access_token;
      return { success: true, data: authData, error: null };
    } catch (error: any) {
      const errorData: ErrorResponse = error.response.data;
      return { success: false, data: null, error: errorData };
    }
  },

  refreshToken: async (): Promise<ApiResponse<BackendAuthResponse>> => {
    try {
      const response = await authApi.post("refresh-token", {});
      const authData: BackendAuthResponse = response.data;
      currentAccessToken = authData.access_token;
      return { success: true, data: authData, error: null };
    } catch (error: any) {
      const errorData: ErrorResponse = error.response?.data;
      return { success: false, data: null, error: errorData };
    }
  },
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (currentAccessToken) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    console.log(config);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await authAPI.refreshToken();

        if (refreshResponse.success && refreshResponse.data) {
          currentAccessToken = refreshResponse.data.access_token;
          originalRequest.headers.Authorization = `Bearer ${currentAccessToken}`;
          return api(originalRequest);
        } else {
          currentAccessToken = null;
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (refreshError) {
        currentAccessToken = null;
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// User API calls
export const userAPI = {
  getUser: async (): Promise<ApiResponse<UserProfileResponse>> => {
    try {
      const response = await api.get("users/me");
      const userResponse: UserProfileResponse = response.data;
      return { success: true, data: userResponse, error: null };
    } catch (err: any) {
      const errorResponse: ErrorResponse = err.response.data;
      return { success: false, data: null, error: errorResponse };
    }
  },

  updateProfile: async (
    updatedUser: UserUpdateRequest
  ): Promise<ApiResponse<UserProfileResponse>> => {
    try {
      const formData = new FormData();
      formData.append("id", updatedUser.id?.toString() || "");
      formData.append("github_username", updatedUser.github_username || "");
      formData.append("name", updatedUser.name || "");
      formData.append("email", updatedUser.email || "");
      formData.append("phone", updatedUser.phone || "");
      updatedUser.resume_paths?.map((resume_path) => {
        formData.append("resume_paths", resume_path);
      });
      updatedUser.file && formData.append("file", updatedUser.file);
      const response = await api.put("users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updateUserData: UserProfileResponse = response.data;
      return { success: true, data: updateUserData, error: null };
    } catch (err: any) {
      const errorResponse: ErrorResponse = err.response.data;
      return { success: false, data: null, error: errorResponse };
    }
  },
};

export const interactionsAPI = {
  getAppliedJobs: async (
    page: number,
    limit: number
  ): Promise<ApiResponse<AppliedJobsResponse>> => {
    try {
      const response = await api.get("interactions/applied", {
        params: {
          page: page,
          limit: limit,
        },
      });
      const appliedJobs: AppliedJobsResponse = response.data;
      return { success: true, data: appliedJobs, error: null };
    } catch (error: any) {
      const errorResponse: ErrorResponse = error.response.data;
      return { success: false, data: null, error: errorResponse };
    }
  },
};

// Jobs API calls
export const jobsAPI = {
  searchJobs: async (filters: any, startIndex: number) => {
    try {
      const response = await api.get("jobs/search/", {
        params: { ...filters, start: startIndex },
      });
      return { STATUS_CODE: response.status, DATA: response.data };
    } catch (error: any) {
      return {
        STATUS_CODE: error.response?.status || 500,
        DATA: error.response?.data || "Failed to search jobs",
      };
    }
  },

  getDynamicFilterOptions: async (filterType: string, query: string) => {
    try {
      const response = await api.get("jobs/filters/", {
        params: { type: filterType, q: query },
      });
      return { STATUS_CODE: response.status, DATA: response.data };
    } catch (error: any) {
      return {
        STATUS_CODE: error.response?.status || 500,
        DATA: error.response?.data || "Failed to get filter options",
      };
    }
  },
};

export default api;
