import { useReducer } from "react";
import type { ReactNode } from "react";

import type AuthState from "../models/AuthState";
import type { AuthAction } from "../models/AuthAction";
import { AuthContext, AuthDispatchContext } from "./contexts";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const unauthorizedState: AuthState = {
    loggedIn: false,
    loading: true,
    accessToken: null,
  };

  const authReducer = (
    authState: AuthState,
    authAction: AuthAction
  ): AuthState => {
    switch (authAction.action) {
      case "LOGIN":
        return {
          loggedIn: true,
          loading: false,
          accessToken: authAction.accessToken,
        };
      case "REFRESH_TOKEN":
        return {
          loggedIn: true,
          loading: false,
          accessToken: authAction.accessToken
        };
      case "LOGOUT":
        return {
          loggedIn: false,
          loading: false,
          accessToken: null,
        };
      case "LOADING":
        return {
          ...authState,
          loading: true,
        };
      case "LOADING_COMPLETE":
        return {
          ...authState,
          loading: false,
        };
      default:
        return authState;
    }
  };

  const [authState, dispatch] = useReducer(authReducer, unauthorizedState);

  return (
    <AuthContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}