import { FaGithub, FaShieldAlt, FaRocket, FaUsers } from "react-icons/fa";

import { authAPI } from "../api";
// import { useContext, useEffect } from "react";

export default function LoginPage() {

  const handleGitHubLogin = () => {
    authAPI.githubLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col max-w-6xl mx-auto px-6 py-8 items-center">
        {/* Header */}
        <div className="flex flex-row text-green-900 text-5xl font-bold justify-center items-center mt-16 mb-8">
          <h1 className="text-center leading-tight">Welcome to Periscope!</h1>
        </div>

        {/* Subtitle */}
        <div className="text-green-700 text-xl text-center mb-16 max-w-2xl">
          <p>Scope jobs that perfectly match your resume!</p>
        </div>

        {/* Main Login Section */}
        <div className="flex flex-row justify-center items-center w-full max-w-md mb-16">
          <div className="w-full border-2 border-gray-200 rounded-xl p-8 bg-white shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Get Started</h2>
              <p className="text-gray-600">
                Sign in with your GitHub account to get started
              </p>
            </div>

            {/* GitHub Login Button */}
            <button
              onClick={handleGitHubLogin}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
            >
              <FaGithub className="mr-3 text-xl" />
              Continue with GitHub
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                We'll never post anything without your permission
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-green-800 mb-2">Why Choose Periscope?</h3>
            <p className="text-gray-600">Smart job matching and application tracking made simple</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-green-600 text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-green-800 mb-2">Built for Developers</h4>
              <p className="text-gray-600 text-sm">
                Built by developers, for developers. A streamlined job search experience designed with your workflow in mind.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-green-600 text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-green-800 mb-2">Fast & Efficient</h4>
              <p className="text-gray-600 text-sm">
                Streamlined job search process. Find opportunities quickly and track your applications effortlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-green-800 mb-2">Application Tracking</h4>
              <p className="text-gray-600 text-sm">
                Keep track of all your job applications in one place. Never lose sight of opportunities or follow-ups again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}