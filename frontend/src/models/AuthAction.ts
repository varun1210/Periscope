export type AuthAction =
  | { action: "LOGIN"; accessToken: string | null }
  | { action: 'REFRESH_TOKEN'; accessToken: string | null}
  | { action: "LOGOUT" }
  | { action: "LOADING" }
  | { action: "LOADING_COMPLETE" };
