// import { useState, useEffect } from "react";
// import { useSearchParams, Link } from "react-router-dom";

// import { authAPI } from "../api";

// export default function VerifyEmail() {
//   const [searchParams] = useSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [verificationSuccess, setVerificationSuccess] = useState(false);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const getVerificationStatus = async () => {
//       const verificationToken = searchParams.get("token");
      
//       if (!verificationToken) {
//         setError("No verification token provided");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await authAPI.verifyEmail(verificationToken);
//         if (response.STATUS_CODE === 200) {
//           setVerificationSuccess(true);
//         } else {
//           setError(response.DATA?.detail || "Email verification failed");
//         }
//       } catch (err: any) {
//         setError(err.message || "An error occurred during verification");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getVerificationStatus();
//   }, [searchParams]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="max-w-md mx-auto px-6 py-8">
//           <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
//             <div className="mb-6">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
//               <p className="text-gray-600 text-sm">
//                 Please wait while we verify your email address...
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (verificationSuccess) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="max-w-md mx-auto px-6 py-8">
//           <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
//             <div className="mb-6">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-bold text-green-900 mb-2">Email Verified!</h2>
//               <p className="text-gray-600 text-sm leading-relaxed mb-6">
//                 Your email has been successfully verified. You can now sign in to your Periscope account.
//               </p>
//             </div>
            
//             <Link
//               to="/login"
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
//             >
//               Sign In to Periscope
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Verification failed
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="max-w-md mx-auto px-6 py-8">
//         <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
//           <div className="mb-6">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-red-900 mb-2">Verification Failed</h2>
//             <p className="text-gray-600 text-sm leading-relaxed mb-2">
//               {error || "We couldn't verify your email address. The verification link may have expired or is invalid."}
//             </p>
//             <p className="text-gray-500 text-xs mb-6">
//               Please try signing up again or contact support if you continue to have issues.
//             </p>
//           </div>
          
//           <div className="space-y-3">
//             <Link
//               to="/signup"
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
//             >
//               Sign Up Again
//             </Link>
//             <Link
//               to="/login"
//               className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
//             >
//               Back to Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }