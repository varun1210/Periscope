import { useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext, UserContext } from "./contexts";
import { userAPI } from "../api";
import type User from "../models/User";

interface Props {
  children: ReactNode;
}

export default function UserProvider({ children }: Props) {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (user: User) => {
    setUser(user);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authContext.loggedIn) {
        setUser(null);
        return;
      }

      try {
        const response = await userAPI.getUser();
        const newUser = {
          userId: response.data?.id || null,
          githubUserName: response.data?.github_username || null,
          name: response.data?.name || null,
          email: response.data?.email || null,
          phone: response.data?.phone || null,
          resumePaths: response.data?.resume_paths || null,
        };
        setUser(newUser);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUserData();
  }, [authContext]);

  return (
    <UserContext.Provider value={{ user: user, updateFunction: updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
