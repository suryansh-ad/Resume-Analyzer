"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AuthPanel } from "./AuthPanel";
import { supabase } from "../lib/supabase/client";

const AuthContext = createContext({
  user: null,
  authReady: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function LayoutWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authError, setAuthError] = useState("");
  const userRef = useRef(null);

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      console.log("[LayoutWrapper] Auth Event:", event, nextSession?.user?.email);
      const currentUser = nextSession?.user ?? null;
      userRef.current = currentUser;
      setUser(currentUser);
      setAuthReady(true);

      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecovery(true);
        setTimeout(() => {
          window.location.hash = "auth";
        }, 100);
      } else if (currentUser) {
        setPasswordRecovery(false);
      } else if (event === "SIGNED_OUT") {
        setPasswordRecovery(false);
        setAuthError("");
      }
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      userRef.current = currentUser;
      setUser(currentUser);
      setAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      userRef.current = null;
      setPasswordRecovery(false);
      window.location.hash = "";
    } catch (err) {
      console.error("[LayoutWrapper] Error signing out:", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, authReady, signOut: handleSignOut }}>
      <div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar user={user} authReady={authReady} onSignOut={handleSignOut} />

        {authReady && (
          <AuthPanel
            user={user}
            passwordRecovery={passwordRecovery}
            authError={authError}
            onPasswordRecoveryComplete={() => setPasswordRecovery(false)}
            onSignOut={handleSignOut}
          />
        )}

        <main className="flex-grow">{children}</main>

        <Footer />
      </div>
    </AuthContext.Provider>
  );
}
