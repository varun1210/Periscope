import { jobsAPI } from "../api";
import type  { JobSearchResponse } from "../models/ApiModels";

export default async function performQuickSearch (searchQuery: string): Promise<JobSearchResponse> {
    try {
        const searchResults = await jobsAPI.searchJobs(searchQuery);
        if (!searchResults.success || !searchResults.data) {
            throw new Error(
                searchResults.error?.content.error ||
                "Something went wrong while performing quick the search. Please try again later."
            );
        }
        return searchResults.data;
    } catch (error) {
        console.error("Failed to perform quick search:", error);
        throw new Error(
            "An unexpected error occurred while performing the quick search. Please try again later."
        );
    }
} 