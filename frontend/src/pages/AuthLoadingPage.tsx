import { useContext, useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";

import { authAPI } from "../api";
import {
  AuthContext,
  AuthDispatchContext
} from "../utils/contexts";

export default function AuthLoadingPage() {
  const authState = useContext(AuthContext);
  const dispatch = useContext(AuthDispatchContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get("code");
      
      if (!code) {
        // No code parameter, redirect to login
        return;
      }

      dispatch({ action: "LOADING" });

      try {
        const response = await authAPI.login(code);
        
        if (response.success && response.data?.access_token) {
          dispatch({
            action: "LOGIN",
            accessToken: response.data.access_token,
          });
        } else {
          console.error("Login failed:", response.error);
          dispatch({ action: "LOADING_COMPLETE" });
        }
      } catch (error) {
        console.error("Auth error:", error);
        dispatch({ action: "LOADING_COMPLETE" });
      }
    };

    handleAuth();
  }, [searchParams, dispatch]);

  // Redirect to home if already logged in
  if (authState.loggedIn) {
    return <Navigate to="/home" replace />;
  }

  // Redirect to login if no code or login failed
  if (!authState.loading && !authState.loggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
}