import type User from "./User";

export default interface UserContextType {
    user: User | null,
    updateFunction: (updatedUser: User) =>  void
}