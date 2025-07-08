// import { useState, useContext } from "react";
// import { Link } from "react-router-dom";

// import { authAPI } from "../api";
// import { AuthContext, AuthDispatchContext } from "../utils/contexts";
// import { Navigate } from "react-router-dom";

// import {
//   validateFormSubmission,
//   getFieldError,
//   formatPhoneNumber,
//   type TouchedFields,
// } from "../utils/UserValidation";

// export default function SignupPage() {
//   const authState = useContext(AuthContext);
//   const dispatch = useContext(AuthDispatchContext);
//   const [redirectLogin, setRedirectLogin] = useState(false);
//   const [firstName, setFirstName] = useState<string>("");
//   const [lastName, setLastName] = useState<string>("");
//   const [middleName, setMiddleName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [confirmPassword, setConfirmPassword] = useState<string>("");
//   const [phone, setPhone] = useState<string>("");
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

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     // Client-side validation using shared utility
//     const validationError = validateFormSubmission({
//       firstName,
//       lastName,
//       middleName,
//       email,
//       phone,
//       password,
//       confirmPassword,
//     });

//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setIsLoading(true);
//     dispatch({ action: "LOADING" });

//     try {
//       const response = await authAPI.register(
//         email,
//         password,
//         firstName,
//         lastName,
//         middleName,
//         phone
//       );
//       if (response.STATUS_CODE !== 201) {
//         throw new Error(response.DATA.detail);
//       }
//       setRedirectLogin(true);
//     } catch (err: any) {
//       dispatch({ action: "LOADING_COMPLETE" });
//       setError(err.message || "Failed to create account. Please try again.");
//     } finally {
//       setIsLoading(false);
//       dispatch({ action: "LOADING_COMPLETE" });
//     }
//   };

//   if (authState.loggedIn) {
//     return <Navigate to="/home" />;
//   }

//   if (redirectLogin) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="max-w-md mx-auto px-6 py-8">
//           <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
//             <div className="mb-6">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-green-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-bold text-green-900 mb-2">
//                 Account Created!
//               </h2>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 An email has been sent to <strong>{email}</strong> to verify
//                 your account. Please check your inbox and verify your email to
//                 complete the signup process.
//               </p>
//             </div>

//             <Link
//               to="/login"
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
//             >
//               Back to Login
//             </Link>

//             <p className="text-xs text-gray-500 mt-4">
//               Didn't receive the email? Check your spam folder or contact
//               support.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col max-w-6xl mx-auto px-6 py-8 items-center">
//         {/* Header */}
//         <div className="flex flex-row text-green-900 text-5xl font-bold justify-center items-center mt-16 mb-12">
//           <h1 className="text-center leading-tight">Join Periscope!</h1>
//         </div>

//         {/* Signup Form */}
//         <div className="flex flex-row justify-center items-center w-full max-w-md">
//           <div className="w-full border-2 border-gray-200 rounded-xl p-8 bg-white shadow-sm">
//             <form onSubmit={handleSignup} className="space-y-6">
//               {/* First Name Input */}
//               <div>
//                 <label
//                   htmlFor="firstName"
//                   className="block text-sm font-semibold text-green-800 mb-2"
//                 >
//                   First Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="firstName"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   onBlur={() =>
//                     setTouched((prev) => ({ ...prev, firstName: true }))
//                   }
//                   className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
//                     getFieldError("firstName", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })
//                       ? "border-red-200 focus:border-red-500"
//                       : "border-gray-200 focus:border-green-500"
//                   }`}
//                   placeholder="Enter your first name"
//                   required
//                 />
//                 {getFieldError("firstName", touched, {
//                   firstName,
//                   lastName,
//                   middleName,
//                   email,
//                   phone,
//                   password,
//                   confirmPassword,
//                 }) && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {getFieldError("firstName", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })}
//                   </p>
//                 )}
//               </div>

//               {/* Last Name Input */}
//               <div>
//                 <label
//                   htmlFor="lastName"
//                   className="block text-sm font-semibold text-green-800 mb-2"
//                 >
//                   Last Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="lastName"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   onBlur={() =>
//                     setTouched((prev) => ({ ...prev, lastName: true }))
//                   }
//                   className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
//                     getFieldError("lastName", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })
//                       ? "border-red-200 focus:border-red-500"
//                       : "border-gray-200 focus:border-green-500"
//                   }`}
//                   placeholder="Enter your last name"
//                   required
//                 />
//                 {getFieldError("lastName", touched, {
//                   firstName,
//                   lastName,
//                   middleName,
//                   email,
//                   phone,
//                   password,
//                   confirmPassword,
//                 }) && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {getFieldError("lastName", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })}
//                   </p>
//                 )}
//               </div>

//               {/* Middle Name Input */}
//               <div>
//                 <label
//                   htmlFor="middleName"
//                   className="block text-sm font-semibold text-green-800 mb-2"
//                 >
//                   Middle Name
//                 </label>
//                 <input
//                   type="text"
//                   id="middleName"
//                   value={middleName}
//                   onChange={(e) => setMiddleName(e.target.value)}
//                   onBlur={() =>
//                     setTouched((prev) => ({ ...prev, middleName: true }))
//                   }
//                   className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
//                     getFieldError("middleName", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })
//                       ? "border-red-200 focus:border-red-500"
//                       : "border-gray-200 focus:border-green-500"
//                   }`}
//                   placeholder="Enter your middle name (optional)"
//                 />
//                 {getFieldError("middleName", touched, {
//                   firstName,
//                   lastName,
//                   middleName,
//                   email,
//                   phone,
//                   password,
//                   confirmPassword,
//                 }) && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {getFieldError("middleName", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })}
//                   </p>
//                 )}
//               </div>

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
//                     getFieldError("email", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })
//                       ? "border-red-200 focus:border-red-500"
//                       : "border-gray-200 focus:border-green-500"
//                   }`}
//                   placeholder="Enter your email"
//                   required
//                 />
//                 {getFieldError("email", touched, {
//                   firstName,
//                   lastName,
//                   middleName,
//                   email,
//                   phone,
//                   password,
//                   confirmPassword,
//                 }) && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {getFieldError("email", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })}
//                   </p>
//                 )}
//               </div>

//               {/* Phone Input */}
//               <div>
//                 <label
//                   htmlFor="phone"
//                   className="block text-sm font-semibold text-green-800 mb-2"
//                 >
//                   Phone Number (Optional)
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   value={phone}
//                   onChange={(e) => {
//                     const cleaned = e.target.value.replace(/\D/g, "");
//                     if (cleaned.length <= 10) {
//                       const formatted = formatPhoneNumber(cleaned);
//                       setPhone(formatted);
//                     }
//                   }}
//                   onBlur={() =>
//                     setTouched((prev) => ({ ...prev, phone: true }))
//                   }
//                   maxLength={14}
//                   className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
//                     getFieldError("phone", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })
//                       ? "border-red-200 focus:border-red-500"
//                       : "border-gray-200 focus:border-green-500"
//                   }`}
//                   placeholder="(123) 456-7890"
//                 />
//                 {getFieldError("phone", touched, {
//                   firstName,
//                   lastName,
//                   middleName,
//                   email,
//                   phone,
//                   password,
//                   confirmPassword,
//                 }) && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {getFieldError("phone", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })}
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
//                     getFieldError("password", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })
//                       ? "border-red-200 focus:border-red-500"
//                       : "border-gray-200 focus:border-green-500"
//                   }`}
//                   placeholder="Create a password"
//                   required
//                 />
//                 {getFieldError("password", touched, {
//                   firstName,
//                   lastName,
//                   middleName,
//                   email,
//                   phone,
//                   password,
//                   confirmPassword,
//                 }) && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {getFieldError("password", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })}
//                   </p>
//                 )}
//               </div>

//               {/* Confirm Password Input */}
//               <div>
//                 <label
//                   htmlFor="confirmPassword"
//                   className="block text-sm font-semibold text-green-800 mb-2"
//                 >
//                   Confirm Password <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   id="confirmPassword"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   onBlur={() =>
//                     setTouched((prev) => ({ ...prev, confirmPassword: true }))
//                   }
//                   className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
//                     getFieldError("confirmPassword", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })
//                       ? "border-red-200 focus:border-red-500"
//                       : "border-gray-200 focus:border-green-500"
//                   }`}
//                   placeholder="Confirm your password"
//                   required
//                 />
//                 {getFieldError("confirmPassword", touched, {
//                   firstName,
//                   lastName,
//                   middleName,
//                   email,
//                   phone,
//                   password,
//                   confirmPassword,
//                 }) && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {getFieldError("confirmPassword", touched, {
//                       firstName,
//                       lastName,
//                       middleName,
//                       email,
//                       phone,
//                       password,
//                       confirmPassword,
//                     })}
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
//                 disabled={
//                   isLoading ||
//                   !email ||
//                   !password ||
//                   !firstName ||
//                   !lastName ||
//                   !confirmPassword
//                 }
//                 className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
//               >
//                 {isLoading ? "Creating Account..." : "Create Account"}
//               </button>
//             </form>

//             {/* Additional Links */}
//             <div className="mt-6 text-center space-y-2">
//               <div className="text-sm text-gray-600">
//                 Already have an account?
//                 <br />
//                 <Link
//                   to="/login"
//                   className="text-green-700 hover:text-green-800 font-semibold transition-colors duration-200"
//                 >
//                   Sign in here
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }