import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

type UnifiedUser = {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  role: string;
  authType: "oauth" | "local";
};

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const user: UnifiedUser | null = useMemo(() => {
    if (oauthUser) {
      return {
        id: oauthUser.id,
        name: oauthUser.name || "User",
        email: oauthUser.email || undefined,
        avatar: oauthUser.avatar || undefined,
        role: oauthUser.role,
        authType: "oauth" as const,
      };
    }
    if (localUser) {
      return {
        id: localUser.id,
        name: localUser.name || localUser.displayName || localUser.username,
        email: localUser.email || undefined,
        role: localUser.role,
        authType: "local" as const,
      };
    }
    return null;
  }, [oauthUser, localUser]);

  const isLoading = oauthLoading || localLoading;
  const isAdmin = user?.role === "admin";

  const logout = useCallback(() => {
    // Always clear local auth token
    localStorage.removeItem("local_auth_token");
    // Always call OAuth logout
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        window.location.reload();
      },
    });
  }, [logoutMutation]);

  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      isAdmin,
      logout,
    }),
    [user, isLoading, isAdmin, logout],
  );
}
