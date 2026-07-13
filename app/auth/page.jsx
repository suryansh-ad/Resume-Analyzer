"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/LayoutWrapper";
import { AuthPanel } from "../../components/AuthPanel";

export default function AuthPage() {
  const { 
    user, 
    authReady, 
    passwordRecovery, 
    setPasswordRecovery, 
    authError, 
    signOut 
  } = useAuth();
  
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if user is already signed in
    if (authReady && user && !passwordRecovery) {
      router.push("/");
    }
  }, [user, authReady, passwordRecovery, router]);

  if (!authReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.015] blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AuthPanel
          user={user}
          passwordRecovery={passwordRecovery}
          authError={authError}
          onPasswordRecoveryComplete={() => setPasswordRecovery(false)}
          onSignOut={signOut}
        />
      </div>
    </div>
  );
}
