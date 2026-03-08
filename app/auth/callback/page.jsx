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
        .then(() => router.replace("/"))
        .catch(() => router.replace("/login"));
    }
  }, []);

  return <p>Logging you in...</p>;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CallbackHandler />
    </Suspense>
  );
}