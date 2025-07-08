// import { useState, useContext } from "react";
// import { Link } from "react-router-dom";

// import { authAPI, setAccessToken } from "../api";
// import { AuthContext, AuthDispatchContext } from "../utils/contexts";
// import { Navigate } from "react-router-dom";

// import {
//   validateEmail,
//   validatePassword,
//   getFieldError,
//   type TouchedFields
// } from "../utils/UserValidation";

// export default function LoginPage() {
//   const authState = useContext(AuthContext);
//   const dispatch = useContext(AuthDispatchContext);
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [touched, setTouched] = useState<TouchedFields>({
//     firstName: false,
//     lastName: false,
//     middleName: false,
//     email: false,
//     phone: false,
//     password: false,
//     confirmPassword: false,
//   });

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     // Client-side validation using shared utilities
//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     const passwordError = validatePassword(password);
//     if (passwordError) {
//       setError(passwordError);
//       return;
//     }

//     setIsLoading(true);
//     dispatch({ action: "LOADING" });

//     try {
//       const response = await authAPI.login(email, password);
//       if (response.STATUS_CODE !== 200) {
//         throw new Error(response.DATA.detail);
//       }
//       dispatch({
//         action: "LOGIN",
//         payload: {
//           userId: response.DATA.user_id,
//           accessToken: response.DATA.access_token,
//         },
//       });
//       setAccessToken(response.DATA.access_token)
//     } catch (err: any) {
//       dispatch({ action: "LOADING_COMPLETE" });
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//       dispatch({ action: "LOADING_COMPLETE" });
//     }
//   };

//   if (authState.loggedIn) {
//     return <Navigate to="/home" />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col max-w-6xl mx-auto px-6 py-8 items-center">
//         {/* Header */}
//         <div className="flex flex-row text-green-900 text-5xl font-bold justify-center items-center mt-16 mb-12">
//           <h1 className="text-center leading-tight">Welcome to Periscope!</h1>
//         </div>

//         {/* Login Form */}
//         <div className="flex flex-row justify-center items-center w-full max-w-md">
//           <div className="w-full border-2 border-gray-200 rounded-xl p-8 bg-white shadow-sm">
//             <form onSubmit={handleLogin} className="space-y-6">
//               {/* Email Input */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-semibold text-green-800 mb-2"
//                 >
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onBlur={() =>
//                     setTouched((prev) => ({ ...prev, email: true }))
//                   }
//                   className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
//                     getFieldError("email", touched, { email, password })
//                       ? "border-red-200 focus:border-red-500"
//                       : "border-gray-200 focus:border-green-500"
//                   }`}
//                   placeholder="Enter your email"
//                   required
//                 />
//                 {getFieldError("email", touched, { email, password }) && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {getFieldError("email", touched, { email, password })}
//                   </p>
//                 )}
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-semibold text-green-800 mb-2"
//                 >
//                   Password <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onBlur={() =>
//                     setTouched((prev) => ({ ...prev, password: true }))
//                   }
//                   className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
//                     getFieldError("password", touched, { email, password })
//                       ? "border-red-200 focus:border-red-500"
//                       : "border-gray-200 focus:border-green-500"
//                   }`}
//                   placeholder="Enter your password"
//                   required
//                 />
//                 {getFieldError("password", touched, { email, password }) && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {getFieldError("password", touched, { email, password })}
//                   </p>
//                 )}
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                   {error}
//                 </div>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading || !email || !password}
//                 className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
//               >
//                 {isLoading ? "Signing In..." : "Sign In"}
//               </button>
//             </form>

//             {/* Additional Links */}
//             <div className="mt-6 text-center space-y-2">
//               <Link
//                 to="/forgot-password"
//                 className="block text-sm text-green-700 hover:text-green-800 transition-colors duration-200"
//               >
//                 <br />
//                 Forgot your password?
//               </Link>
//               <br />
//               <div className="text-sm text-gray-600">
//                 Don't have an account?
//                 <br />
//                 <Link
//                   to="/signup"
//                   className="text-green-700 hover:text-green-800 font-semibold transition-colors duration-200"
//                 >
//                   Sign up here
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }