"use client";
import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios.post("/api/auth/set-cookie", { token })
        .then(() => {
          setTimeout(() => router.replace("/"), 500);
        })
        .catch(() => router.replace("/login"));
    }
  }, []);

  return (
    <div className="w-full h-dvh flex flex-col items-center pt-12 gap-3">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-foreground/60 text-sm font-medium">Logging you in...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="w-full h-dvh flex flex-col items-center pt-12 gap-3">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-foreground/60 text-sm font-medium">Loading...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}