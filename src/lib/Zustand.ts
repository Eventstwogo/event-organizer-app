"use client";

import { create } from "zustand";
import jwt from "jsonwebtoken";

interface UserData {
  is_approved: number;
  ref_number?: string;
  onboarding_status?: string;
  [key: string]: any;
}

interface DecodedToken {
  uid: string;
  rid: string;
  [key: string]: any;
}

interface AuthState {
  userId: string | null;
  bprofileId: string | null;
  user: UserData | null;
  exp: number | null;
  isAuthenticated: boolean;
  login: (access_token: string, organizer_info: UserData, rememberMe?: boolean) => void;
  logout: () => void;
  checkAuth: () => void;
  switchAccount: (token: string, user?: UserData) => void;
}

const getTabId = (): string => {
  if (typeof window === "undefined") return "";
  let tabId = sessionStorage.getItem("tabId");

  if (!tabId) {
    tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("tabId", tabId);
  }

  return tabId;
};

const getActiveAccounts = (): Record<string, any> => {
  if (typeof window === "undefined") return {};
  const accounts = localStorage.getItem("activeAccounts");
  return accounts ? JSON.parse(accounts) : {};
};

const setActiveAccount = (tabId: string, userInfo: any) => {
  if (typeof window === "undefined") return;
  const accounts = getActiveAccounts();

  accounts[tabId] = {
    ...userInfo,
    lastActive: Date.now(),
  };

  localStorage.setItem("activeAccounts", JSON.stringify(accounts));
};

const removeActiveAccount = (tabId: string) => {
  if (typeof window === "undefined") return;
  const accounts = getActiveAccounts();
  delete accounts[tabId];
  localStorage.setItem("activeAccounts", JSON.stringify(accounts));
};

const useStore = create<AuthState>((set, get) => ({
  userId: null,
  bprofileId: null,
  user: null,
  exp: null,
  isAuthenticated: false,

  login: (access_token: string, organizer_info: UserData, rememberMe: boolean = true) => {
    if (!access_token) {
      console.error("No access token received");
      return;
    }

    try {
      const decoded = jwt.decode(access_token) as DecodedToken | null;

      if (decoded?.uid && decoded?.rid) {
        const tabId = getTabId();

        const userData: UserData = {
          is_approved: organizer_info?.is_approved ?? -1,
          ref_number: organizer_info?.ref_number || "",
          onboarding_status: organizer_info?.onboarding_status || "",
        };

        set({
          userId: decoded.uid,
          bprofileId: decoded.rid,
          exp: decoded.exp,
          user: userData,
          isAuthenticated: true,
        });

        const userInfo = {
          userId: decoded.uid,
          bprofileId: decoded.rid,
          exp: decoded.exp,
          token: access_token,
          user: userData,
        };

        if (rememberMe) {
          localStorage.setItem(`auth_${tabId}`, JSON.stringify(userInfo));
        }

        sessionStorage.setItem("currentAuth", JSON.stringify(userInfo));
        setActiveAccount(tabId, userInfo);
      } else {
        console.error("Invalid token format", decoded);
      }
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  },

  switchAccount: (token: string, user?: UserData) => {
    const tabId = getTabId();
    sessionStorage.removeItem("currentAuth");
    removeActiveAccount(tabId);

    let userData: UserData = user || { is_approved: -1, ref_number: "", onboarding_status: "" };

    if (!user) {
      const accounts = getActiveAccounts();
      const account = Object.values(accounts).find((acc: any) => acc.token === token);
      if (account && account.user) {
        userData = {
          is_approved: account.user.is_approved,
          ref_number: account.user.ref_number || "",
          onboarding_status: account.user.onboarding_status || "",
        };
      }
    }

    get().login(token, userData, true);
  },

  logout: () => {
    const tabId = getTabId();
    set({
      userId: null,
      bprofileId: null,
      exp: null,
      user: null,
      isAuthenticated: false,
    });

    localStorage.removeItem(`auth_${tabId}`);
    sessionStorage.removeItem("currentAuth");
    removeActiveAccount(tabId);
  },

  checkAuth: () => {
    if (typeof window === "undefined") return;

    const tabId = getTabId();
    let authData = sessionStorage.getItem("currentAuth");

    if (!authData) {
      authData = localStorage.getItem(`auth_${tabId}`);
      if (authData) {
        sessionStorage.setItem("currentAuth", authData);
      }
    }

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const { token, userId, bprofileId, exp, user } = parsed;

        if (exp && exp * 1000 < Date.now()) {
          console.log("Token expired, logging out");
          get().logout();
          return;
        }

        const decoded = jwt.decode(token) as DecodedToken | null;

        if (decoded && decoded.uid === userId && decoded.rid === bprofileId) {
          set({
            userId,
            bprofileId,
            exp,
            user,
            isAuthenticated: true,
          });

          setActiveAccount(tabId, parsed);
        } else {
          console.error("Token validation failed");
          get().logout();
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        get().logout();
      }
    }
  },
}));

if (typeof window !== "undefined") {
  const cleanupInactiveTabs = () => {
    const accounts = getActiveAccounts();
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;

    Object.keys(accounts).forEach((tabId) => {
      if (accounts[tabId].lastActive < cutoffTime) {
        localStorage.removeItem(`auth_${tabId}`);
        delete accounts[tabId];
      }
    });

    localStorage.setItem("activeAccounts", JSON.stringify(accounts));
  };

  cleanupInactiveTabs();

  window.addEventListener("beforeunload", () => {
    const tabId = getTabId();
    removeActiveAccount(tabId);
  });
}

useStore.getState().checkAuth();

export default useStore;

export const getActiveAccountsList = () => {
  const accounts = getActiveAccounts();

  return Object.entries(accounts).map(([tabId, info]: [string, any]) => ({
    tabId,
    userId: info.userId,
    bprofileId: info.bprofileId,
    lastActive: info.lastActive,
  }));
};

export const switchToAccount = (targetUserId: string) => {
  const accounts = getActiveAccounts();

  const targetAccount = Object.values(accounts).find(
    (acc: any) => acc.userId === targetUserId
  );

  if (targetAccount) {
    useStore
      .getState()
      .switchAccount((targetAccount as any).token, (targetAccount as any).user);
  }
};