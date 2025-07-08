import { useContext, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

import { authAPI } from "../api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  AuthContext,
  AuthDispatchContext,
  UserContext,
} from "../utils/contexts";

export default function PeriscopeLayout() {
  const authState = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const dispatch = useContext(AuthDispatchContext);
  const location = useLocation(); // Add this

  useEffect(() => {
    const layoutLoad = async () => {
      if (authState.loading) {
        try {
          const response = await authAPI.refreshToken();
          if (response.success && response.data?.access_token) {
            dispatch({
              action: "REFRESH_TOKEN",
              accessToken: response.data.access_token,
            });
          } else {
            dispatch({ action: "LOADING_COMPLETE" });
          }
        } catch (err: any) {
          console.log("Refresh failed:", err);
          dispatch({ action: "LOADING_COMPLETE" });
        }
      }
    };

    layoutLoad();
  }, []); // Empty dependency array

  if (authState.loading || (authState.loggedIn && !user)) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authState.loggedIn && !authState.loading) {
    return <Navigate to="/login" replace />;
  }

  // Only redirect if NOT already on resume upload page (THIS FIXES THE INFINITE LOOP)
  if (
    location.pathname !== "/resume-upload" &&
    Array.isArray(user?.resumePaths) &&
    user.resumePaths.length === 2 &&
    user.resumePaths[0] === "" &&
    user.resumePaths[1] === ""
  ) {
    return <Navigate to="/resume-upload" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}