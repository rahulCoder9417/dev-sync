
"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearUser, setUser } from "@/lib/redux/features/userSlice";
import { Toaster } from "@/components/ui/sonner";
import { getProjects } from "@/lib/actions/projects/getProject";
import { clearRecent, setRecent } from "@/lib/redux/features/recentProjects";
import { ChatPopup } from "@/components/main/ChatPopUp";
import { useChatInitializer } from "@/lib/redux/chatInitializer";


export function ClientApp({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const dispatch = useAppDispatch();
useChatInitializer(isLoaded)

  useEffect(() => {
    const fetchUserFromDB = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      const [res, projects,notifications] = await Promise.all([
        fetch("/api/user/findUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" ,
          },
          body: JSON.stringify({ identifier: user.primaryEmailAddress.emailAddress }),
        }),
        getProjects({ limit: 3, type: "recent" }),
        fetch("/api/notification", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      ]);
      
      const data = await res.json();
      const notificationData = await notifications.json();
      if (data.success) {
        dispatch(
          setUser({
            ...data.user,
            isAuthenticated: true,
            notifications:notificationData.notifications
          })
        );
      } else {
        console.error("User fetch failed:", data.error);
      }
      
    if(projects){
      dispatch(
        setRecent(projects.map((i:any)=>({id:i.id,type:i.type,title:i.title,framework:i.framework,description:i.description,lastUpdated:i.lastUpdated,collaborators:i.collaborators}))
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
  }, [isLoaded, user]);

  return (
    <>
      {children}
      <ChatPopup />
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
