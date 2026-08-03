import { useCallback, useEffect, useMemo, useState } from "react";
import { AppWrapper } from "../../components/common/PageMeta";
import { ThemeProvider } from "../../context/ThemeContext";
import {
  clearStoredAuthSession,
  getStoredAuthSession,
  setStoredAuthSession,
} from "../../features/auth/api/authStorage";
import { loginRequest, refreshTokenRequest, revokeTokenRequest } from "../../features/auth/api/authApi";
import { AuthContext } from "../../features/auth/context/AuthContext";
import type {
  AuthContextValue,
  AuthSession,
  LoginFormValues,
} from "../../features/auth/types/auth";
import { configureApiClientSessionBridge } from "../../api/client";

const REDIRECT_PATH = "/signin";

function redirectToSignIn() {
  if (window.location.pathname !== REDIRECT_PATH) {
    window.location.replace(REDIRECT_PATH);
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    setSession(getStoredAuthSession());
    setIsBootstrapping(false);
  }, []);

  const persistSession = useCallback((nextSession: AuthSession | null) => {
    setSession(nextSession);

    if (nextSession) {
      setStoredAuthSession(nextSession);
      return;
    }

    clearStoredAuthSession();
  }, []);

  const refreshSession = useCallback(async () => {
    const current = getStoredAuthSession();

    if (!current?.refreshToken) {
      persistSession(null);
      return null;
    }

    try {
      const nextSession = await refreshTokenRequest({ refreshToken: current.refreshToken });
      persistSession(nextSession);
      return nextSession.accessToken;
    } catch {
      persistSession(null);
      redirectToSignIn();
      return null;
    }
  }, [persistSession]);

  const logout = useCallback(async () => {
    const current = getStoredAuthSession();

    if (current?.refreshToken) {
      try {
        await revokeTokenRequest({ refreshToken: current.refreshToken });
      } catch {
        // best-effort revoke
      }
    }

    persistSession(null);
    redirectToSignIn();
  }, [persistSession]);

  const handleUnauthorized = useCallback(() => {
    persistSession(null);
    redirectToSignIn();
  }, [persistSession]);

  useEffect(() => {
    configureApiClientSessionBridge({
      getAccessToken: () => getStoredAuthSession()?.accessToken ?? null,
      getRefreshToken: () => getStoredAuthSession()?.refreshToken ?? null,
      refreshSession,
      handleUnauthorized,
    });
  }, [handleUnauthorized, refreshSession]);

  const login = useCallback(
    async (values: LoginFormValues) => {
      const nextSession = await loginRequest(values);
      persistSession(nextSession);
      return nextSession;
    },
    [persistSession]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      accessToken: session?.accessToken ?? null,
      refreshToken: session?.refreshToken ?? null,
      isAuthenticated: Boolean(session?.accessToken),
      isBootstrapping,
      login,
      logout,
      setSession: persistSession,
      clearSession: () => persistSession(null),
      refreshSession,
    }),
    [isBootstrapping, login, logout, persistSession, refreshSession, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppWrapper>
        <AuthProvider>{children}</AuthProvider>
      </AppWrapper>
    </ThemeProvider>
  );
}
