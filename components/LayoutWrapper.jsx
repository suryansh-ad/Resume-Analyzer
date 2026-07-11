"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AuthPanel } from "./AuthPanel";
import { ProfileModal } from "./ProfileModal";
import { api } from "../lib/api";
import { supabase } from "../lib/supabase/client";

const AuthContext = createContext({
  user: null,
  authReady: false,
  signOut: async () => {},
  profile: null,
  setProfile: () => {},
  openProfileModal: () => {},
  closeProfileModal: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function LayoutWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authError, setAuthError] = useState("");
  const [profile, setProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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

  useEffect(() => {
    if (user) {
      api.get("/profile")
        .then((res) => {
          const prof = res.data.profile;
          setProfile(prof);

          const profileExists = res.data.profileExists;
          const hasDetails = prof && ((prof.skills || []).length > 0 || (prof.interests || []).length > 0);

          // Prompt onboarding only if they don't have profile details set and haven't skipped in this session yet
          if ((!profileExists || !hasDetails) && !sessionStorage.getItem("onboarding_prompted")) {
            sessionStorage.setItem("onboarding_prompted", "true");
            setIsProfileModalOpen(true);
          }
        })
        .catch((err) => console.error("[LayoutWrapper] Error fetching profile:", err));
    } else {
      setProfile(null);
    }
  }, [user]);

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
    <AuthContext.Provider 
      value={{ 
        user, 
        authReady, 
        signOut: handleSignOut, 
        profile, 
        setProfile, 
        openProfileModal: () => setIsProfileModalOpen(true),
        closeProfileModal: () => setIsProfileModalOpen(false)
      }}
    >
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

        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          user={user}
          currentProfile={profile}
          onProfileSaved={(p) => setProfile(p)}
        />

        <main className="flex-grow pt-[68px] pb-[64px] md:pb-0">{children}</main>

        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

