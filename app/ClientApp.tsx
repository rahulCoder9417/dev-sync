// app/ClientApp.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/features/userSlice";
import { Toaster } from "@/components/ui/sonner";

export function ClientApp({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUserFromDB = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const res = await fetch("/api/user/findUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: user.primaryEmailAddress.emailAddress }),
      });

      const data = await res.json();

      if (data.success) {
        dispatch(
          setUser({
            ...data.user,
            isAuthenticated: true,
          })
        );
      } else {
        console.error("User fetch failed:", data.error);
      }
    };

    if (isLoaded && user) {
      fetchUserFromDB();
    }
  }, [isLoaded, user, dispatch]);

  return (
    <>
      {children}
      <Toaster
        richColors
        closeButton
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "rounded-xl shadow-lg border",
            title: "text-base font-semibold",
            description: "text-sm opacity-90",
          },
        }}
      />
    </>
  );
}
