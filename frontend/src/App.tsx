import { Route, Routes, BrowserRouter } from "react-router-dom";

import AuthProvider from "./utils/AuthProvider";
import UserProvider from "./utils/UserProvider";
import PeriscopeLayout from "./layouts/PeriscopeLayout";

import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import ResumeUploadPage from "./pages/ResumeUploadPage";
import AuthLoadingPage from "./pages/AuthLoadingPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/authorize" element={<AuthLoadingPage />} />
            
            <Route element={<PeriscopeLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/resume-upload" element={<ResumeUploadPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<HomePage />} />
            </Route>
          </Routes>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}