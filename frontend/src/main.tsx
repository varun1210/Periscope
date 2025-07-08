import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";

// function getRequiredEnvVar(name: string): string {
//   const value = process.env[name];
//   if (!value) {
//     throw new Error(`${name} environment variable is required`);
//   }
//   return value;
// }

// export const GITHUB_AUTH_URL: string = getRequiredEnvVar('VITE_GITHUB_AUTH_URL');
// export const API_BASE_URL: string = getRequiredEnvVar('VITE_API_BASE_URL');
// export const AUTH_API_BASE_URL: string = getRequiredEnvVar('VITE_AUTH_API_BASE_URL');

const rootElement: HTMLElement | null = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found!");
}

createRoot(rootElement).render(<App />);
