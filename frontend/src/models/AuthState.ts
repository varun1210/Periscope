export default interface AuthState {
    loggedIn: boolean,
    loading: boolean,
    accessToken: string | null
}