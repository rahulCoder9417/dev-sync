
"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearUser, setUser } from "@/lib/redux/features/userSlice";
import { Toaster } from "@/components/ui/sonner";
import { getProjects } from "@/lib/actions/projects/getProject";
import { clearRecent, setRecent } from "@/lib/redux/features/recentProjects";

export function ClientApp({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUserFromDB = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      
      const [res, projects] = await Promise.all([
        fetch("/api/user/findUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: user.primaryEmailAddress.emailAddress }),
        }),
        getProjects({ limit: 3, type: "recent" }),
      ]);
      
      
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
      
    if(projects){
      dispatch(
        setRecent(projects.map(i=>({id:i.id,type:i.type,title:i.title,framework:i.framework,description:i.description}))
      ));
    }
    };
    if (isLoaded && user) {
      fetchUserFromDB();
    }
    
    return () => {
      dispatch(clearUser());
      dispatch(clearRecent());
    };
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
