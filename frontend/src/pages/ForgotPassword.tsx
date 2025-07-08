// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       if (!email) {
//         throw new Error("Please enter your email address");
//       }

//       // TODO: Replace with your actual forgot password API call
//       // const response = await authAPI.forgotPassword(email);
      
//       // Simulate API call for now
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setMessage("If an account with that email exists, we've sent you a password reset link.");
//     } catch (err: any) {
//       setError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col max-w-6xl mx-auto px-6 py-8 items-center">
//         {/* Header */}
//         <div className="flex flex-row text-green-900 text-5xl font-bold justify-center items-center mt-16 mb-12">
//           <h1 className="text-center leading-tight">Reset Your Password</h1>
//         </div>

//         {/* Forgot Password Form */}
//         <div className="flex flex-row justify-center items-center w-full max-w-md">
//           <div className="w-full border-2 border-gray-200 rounded-xl p-8 bg-white shadow-sm">
//             {!message ? (
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="text-center mb-6">
//                   <p className="text-gray-600 flex items-center justify-center">
//                     Enter your email address and we'll send you a link to reset your password.
//                   </p>
//                 </div>

//                 {/* Email Input */}
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-semibold text-green-800 mb-2"
//                   >
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
//                     placeholder="Enter your email"
//                     required
//                   />
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                     {error}
//                   </div>
//                 )}

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isLoading || !email}
//                   className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
//                 >
//                   {isLoading ? "Sending..." : "Send Reset Link"}
//                 </button>
//               </form>
//             ) : (
//               /* Success Message */
//               <div className="text-center space-y-4">
//                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
//                   {message}
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   Check your email for the reset link. It may take a few minutes to arrive.
//                 </p>
//               </div>
//             )}

//             {/* Back to Login Link */}
//             <div className="mt-6 text-center">
//               <Link
//                 to="/login"
//                 className="text-sm text-green-700 hover:text-green-800 font-semibold transition-colors duration-200 flex items-center justify-center"
//               >
//                 <FaArrowLeft className="mr-2" />
//                 Back to Sign In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }