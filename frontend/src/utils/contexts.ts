import { createContext } from "react";

import type AuthState from "../models/AuthState";
import type { AuthAction } from "../models/AuthAction";
import type UserContextType from "../models/UserContextType";
import type { SearchContextType } from "../models/SearchContext";

export const AuthContext = createContext<AuthState>({
  loggedIn: false,
  loading: true,
  accessToken: null,
});

export const AuthDispatchContext = createContext<(action: AuthAction) => void>(
  () => {
    throw new Error("AuthDispatchContext must be used within AuthProvider");
  }
);

export const UserContext = createContext<UserContextType>({
  user: null,
  updateFunction: () => {},
});

export const SearchContext = createContext<SearchContextType>({
  searchQuery: null,
  filters: null,
  pageNumber: 1,
  searchResults: null,
  fetchedJobs: null,
  updateSearchContext: () => {
    throw new Error("SearchContext must be used within SearchProvider!");
  },
  updateJobList: () => {
    throw new Error("SearchContext must be used within SearchProvider!");
  },
  updatePageNumber: () => {
    throw new Error("SearchContext must be used within SearchProvider!");
  }
});
