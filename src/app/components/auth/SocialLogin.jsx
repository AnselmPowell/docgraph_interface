// // src/app/components/auth/SocialLogin.jsx
// 'use client';

// import { FcGoogle } from 'react-icons/fc';
// import { TfiMicrosoftAlt } from "react-icons/tfi";

// export function SocialLogin({ isLoading, onGoogleLogin, onMicrosoftLogin }) {
//   return (
//     <div className="space-y-4">
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-tertiary/20"></div>
//         </div>
//         <div className="relative flex justify-center text-xs">
//           <span className="px-2 bg-background text-tertiary">
//             Or continue with
//           </span>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <button
//           type="button"
//           onClick={onGoogleLogin}
//           disabled={isLoading}
//           className="w-full px-4 py-2 rounded-md border border-tertiary/20 
//                    bg-background hover:bg-tertiary/5 
//                    flex items-center justify-center gap-2 
//                    text-sm text-secondary transition-colors"
//         >
//           <FcGoogle className="w-5 h-5" />
//           <span>Continue with Google</span>
//         </button>

//         <button
//           type="button"
//           onClick={onMicrosoftLogin}
//           disabled={isLoading}
//           className="w-full px-4 py-2 rounded-md border border-tertiary/20 
//                    bg-background hover:bg-tertiary/5 
//                    flex items-center justify-center gap-2 
//                    text-sm text-secondary transition-colors"
//         >
//           <TfiMicrosoftAlt className="w-5 h-5" />
//           <span>Continue with Microsoft</span>
//         </button>
//       </div>
//     </div>
//   );
// }