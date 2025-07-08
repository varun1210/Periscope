import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiFile } from "react-icons/fi";

import { userAPI } from "../api";

import { UserContext } from "../utils/contexts";

const validateFileType = (file: File): boolean => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  return allowedTypes.includes(fileExtension);
};

const validateFileSize = (file: File, maxSizeMB: number = 1.5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

const validateResumeFile = (file: File): string | null => {
  if (!validateFileType(file)) {
    return "Please upload a PDF or Word document (.pdf, .doc, .docx)";
  }

  if (!validateFileSize(file)) {
    return "File size must be less than 1.5MB";
  }

  return null;
};

export default function ResumeUploadPage() {
  const { user, updateFunction } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validationError = validateResumeFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!user) return;

    setUploading(true);
    setError("");

    try {
      const userResumePaths = [...(user.resumePaths || ["", ""])];
      userResumePaths[0] = selectedFile.name;
      const response = await userAPI.updateProfile({
        id: user.userId,
        github_username: user.githubUserName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        resume_paths: userResumePaths,
        file: selectedFile,
      });
      updateFunction({
        userId: response.data?.id || null,
        githubUserName: response.data?.github_username || null,
        name: response.data?.name || null,
        email: response.data?.email || null,
        phone: response.data?.phone || null,
        resumePaths: response.data?.resume_paths || null,
      });
      navigate("/home");
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setError("");
    // Reset file input
    const fileInput = document.getElementById(
      "resume-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Upload a resume to get started!
          </h1>
          <p className="text-gray-600">
            Share your resume to begin your journey with us.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUpload className="w-6 h-6 text-green-600" />
              </div>

              <label htmlFor="resume-upload" className="block cursor-pointer">
                <span className="text-lg font-medium text-gray-900 block mb-2">
                  Choose your resume file
                </span>
                <span className="text-sm text-gray-500 block mb-4">
                  PDF, DOC, or DOCX files up to 1.5MB
                </span>
                <span className="inline-block px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium">
                  Browse Files
                </span>
              </label>

              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Selected File Display */}
            {selectedFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FiFile className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Your resume will be securely stored and only used for application
            purposes.
          </p>
        </div>
      </div>
    </div>
  );
}