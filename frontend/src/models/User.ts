export default interface User {
    userId: number | null,
    githubUserName: string | null,
    name: string | null,
    email: string | null,
    phone: string | null,
    resumePaths: string[] | null
}