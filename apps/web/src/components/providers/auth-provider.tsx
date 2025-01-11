"use client";

import { FC, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import { Account } from "@repo/sdk";

export interface AuthProviderProps {
  user?: User | undefined;
  account?: Account | undefined;
};

const AuthContext = createContext<AuthProviderProps>({
  user: undefined,
  account: undefined,
});

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider: FC<AuthProviderProps & { children: ReactNode }> =
  ({ children, user, account }) => {
    return (
      <AuthContext.Provider value={{ user, account }}>
        {children}
      </AuthContext.Provider>
    );
  }
