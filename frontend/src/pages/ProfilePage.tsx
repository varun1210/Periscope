import { useState, useEffect, useContext } from "react";
import type { ChangeEvent } from "react";

import { FiEdit2, FiGithub } from "react-icons/fi";

import { UserContext } from "../utils/contexts";
import { userAPI } from "../api";
import type User from "../models/User";

export default function ProfilePage() {
  // const authState = useContext(AuthContext);
  const { user, updateFunction } = useContext(UserContext);
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [primaryResumeFile, setPrimaryResumeFile] = useState<File | null>(null);
  const [secondaryResumeFile, setSecondaryResumeFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setProfile(user);
  }, [user]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">Error loading profile</div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user) return;
    
    const fileToUpload = primaryResumeFile || secondaryResumeFile;
    if (!fileToUpload) {
      setError("Please select a file to upload.");
      return;
    }
    
    const resumeIndex = primaryResumeFile ? 0 : 1;

    setError("");
    setSaving(true);
    
    try {
      const userResumePaths = [...(user.resumePaths || ["", ""])];
      userResumePaths[resumeIndex] = fileToUpload.name;
      
      const response = await userAPI.updateProfile({
        id: user.userId,
        github_username: user.githubUserName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        resume_paths: userResumePaths,
        file: fileToUpload,
      });

      if (response.success && response.data) {
        const updatedUser = {
          userId: response.data.id || null,
          githubUserName: response.data.github_username || null,
          name: response.data.name || null,
          email: response.data.email || null,
          phone: response.data.phone || null,
          resumePaths: response.data.resume_paths || null,
        };
        
        updateFunction(updatedUser);
        setProfile(updatedUser);
        
        setIsEditing(false);
        setPrimaryResumeFile(null);
        setSecondaryResumeFile(null);
      } else {
        setError(response.error?.content.error || "Failed to save resumes. Please try again.");
      }
    } catch (error) {
      console.error("Error saving resumes:", error);
      setError("Failed to save resumes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setPrimaryResumeFile(null);
    setSecondaryResumeFile(null);
  };

  const handlePrimaryResumeUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      setPrimaryResumeFile(file);
      setProfile((currentProfile) => {
        if (!currentProfile) return currentProfile;
        const currentResumes = [...(currentProfile.resumePaths || [])];
        while (currentResumes.length < 2) {
          currentResumes.push('');
        }
        currentResumes[0] = file.name;
        return { ...currentProfile, resumePaths: currentResumes };
      });
    } else {
      setPrimaryResumeFile(null);
    }
  };

  const handleSecondaryResumeUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      setSecondaryResumeFile(file);
      setProfile((currentProfile) => {
        if (!currentProfile) return currentProfile;
        const currentResumes = [...(currentProfile.resumePaths || [])];
        while (currentResumes.length < 2) {
          currentResumes.push('');
        }
        currentResumes[1] = file.name;
        return { ...currentProfile, resumePaths: currentResumes };
      });
    } else {
      setSecondaryResumeFile(null);
    }
  };

  const clearPrimaryResume = () => {
    setPrimaryResumeFile(null);
    setProfile((currentProfile) => {
      if (!currentProfile) return currentProfile;
      const currentResumes = [...(currentProfile.resumePaths || [])];
      while (currentResumes.length < 2) {
        currentResumes.push('');
      }
      currentResumes[0] = user?.resumePaths?.[0] || '';
      return { ...currentProfile, resumePaths: currentResumes };
    });
    const fileInput = document.getElementById('primary-resume') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const clearSecondaryResume = () => {
    setSecondaryResumeFile(null);
    setProfile((currentProfile) => {
      if (!currentProfile) return currentProfile;
      const currentResumes = [...(currentProfile.resumePaths || [])];
      while (currentResumes.length < 2) {
        currentResumes.push('');
      }
      currentResumes[1] = user?.resumePaths?.[1] || '';
      return { ...currentProfile, resumePaths: currentResumes };
    });
    const fileInput = document.getElementById('secondary-resume') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-green-900">
            Profile Information
          </h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              <FiEdit2 size={16} />
              Edit Resumes
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* GitHub Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <FiGithub className="text-blue-600" size={20} />
          <p className="text-blue-800 text-sm">
            Your profile information was imported from GitHub and cannot be edited here.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-green-900 mb-0.5">
                Name
              </label>
              <input
                type="text"
                value={profile.name || ""}
                disabled
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-green-900 mb-0.5">
                Email
              </label>
              <input
                type="email"
                value={profile.email || ""}
                disabled
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-green-900 mb-0.5">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone || ""}
                disabled
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-green-900 mb-0.5">
                Primary Resume
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    id="primary-resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className={`w-full px-3 py-1.5 border rounded-md focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm ${
                      secondaryResumeFile 
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed file:bg-gray-200 file:text-gray-400" 
                        : "border-gray-300 focus:ring-2 focus:ring-green-500 file:bg-green-50 file:text-green-700"
                    }`}
                    onChange={handlePrimaryResumeUpload}
                    disabled={!!secondaryResumeFile}
                  />
                  {secondaryResumeFile && (
                    <p className="text-xs text-gray-500 mt-1">You can only update one resume at a time.</p>
                  )}
                  {primaryResumeFile && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Selected: {primaryResumeFile.name}</span>
                      <button
                        type="button"
                        onClick={clearPrimaryResume}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={profile.resumePaths?.[0]?.split("/").pop() || "No file"}
                  disabled
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-900"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-green-900 mb-0.5">
                Secondary Resume
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    id="secondary-resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className={`w-full px-3 py-1.5 border rounded-md focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm ${
                      primaryResumeFile 
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed file:bg-gray-200 file:text-gray-400" 
                        : "border-gray-300 focus:ring-2 focus:ring-green-500 file:bg-green-50 file:text-green-700"
                    }`}
                    onChange={handleSecondaryResumeUpload}
                    disabled={!!primaryResumeFile}
                  />
                  {primaryResumeFile && (
                    <p className="text-xs text-gray-500 mt-1">You can only update one resume at a time.</p>
                  )}
                  {secondaryResumeFile && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Selected: {secondaryResumeFile.name}</span>
                      <button
                        type="button"
                        onClick={clearSecondaryResume}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={profile.resumePaths?.[1]?.split("/").pop() || "No file"}
                  disabled
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-900"
                />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}