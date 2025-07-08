import { createContext } from "react";

import type AuthState from "../models/AuthState";
import type { AuthAction } from "../models/AuthAction";
import type UserContextType from "../models/UserContextType";


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

export const UserContext = createContext<UserContextType>({ user: null, updateFunction: () => {} });
