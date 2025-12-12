import { useState, useEffect, useCallback } from "react";
import type { Account } from "@/types/response.type";
import type { PermissionString } from "@/types/permission.type";
import { checkPermission } from "@/user/auth/api/auth.api";

/**
 * Hook to get current authenticated user and their permissions
 * Reads from localStorage and optionally syncs from server
 */
export function useAuth() {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingPermissions, setIsSyncingPermissions] = useState(false);

  const loadAccount = useCallback(() => {
    try {
      const storedAccount = localStorage.getItem("account");
      if (storedAccount && storedAccount !== "undefined") {
        const parsedAccount = JSON.parse(storedAccount) as Account;
        if (
          parsedAccount &&
          typeof parsedAccount === "object" &&
          parsedAccount.email
        ) {
          setAccount(parsedAccount);
          return parsedAccount;
        }
      }
      setAccount(null);
      return null;
    } catch (error) {
      console.error("Failed to parse account data:", error);
      localStorage.removeItem("account");
      setAccount(null);
      return null;
    }
  }, []);

  /**
   * Sync permissions from server
   * Updates account with latest permissions from /auth/check-permission endpoint
   */
  const syncPermissions = useCallback(async () => {
    const currentAccount = account;
    if (!currentAccount) {
      return;
    }

    try {
      setIsSyncingPermissions(true);
      const permissionData = await checkPermission();

      // Update account with synced permissions
      const updatedAccount: Account = {
        ...currentAccount,
        permissions: permissionData.permissions as PermissionString[],
        role: permissionData.role,
      };

      // Update localStorage
      localStorage.setItem("account", JSON.stringify(updatedAccount));
      setAccount(updatedAccount);

      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event("account-updated"));

      return permissionData;
    } catch (error) {
      console.error("Failed to sync permissions:", error);
      // Don't throw error - keep using local permissions
      return null;
    } finally {
      setIsSyncingPermissions(false);
    }
  }, [account]);

  useEffect(() => {
    loadAccount();
    setIsLoading(false);

    // Listen for account updates (e.g., after login)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "account") {
        loadAccount();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event for same-tab updates
    const handleAccountUpdate = () => {
      loadAccount();
    };

    window.addEventListener(
      "account-updated",
      handleAccountUpdate as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "account-updated",
        handleAccountUpdate as EventListener
      );
    };
  }, [loadAccount]);

  const updateAccount = useCallback((newAccount: Account | null) => {
    if (newAccount) {
      localStorage.setItem("account", JSON.stringify(newAccount));
    } else {
      localStorage.removeItem("account");
    }
    setAccount(newAccount);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("account-updated"));
  }, []);

  const isAuthenticated = !!account;
  const permissions = account?.permissions || [];

  return {
    account,
    isAuthenticated,
    permissions,
    isLoading,
    isSyncingPermissions,
    updateAccount,
    refreshAccount: loadAccount,
    syncPermissions,
  };
}
