"use client"
import { showToast } from '@/components/main/Toast'
import useTerminal from '@/customHooks/useTerminal'
import { useAppSelector } from '@/lib/redux/hooks'
import React, { useEffect, useState } from 'react'
import NewLoader from '@/components/main/SpiningLoader'
import { X } from 'lucide-react'
import Terminal from './Terminal'

const Preview = ({ projectId }: { projectId: string }) => {
  const [diskStorageSet, setdiskStorageSet] = useState<"idle" | "connecting" | "connected" | "error">("idle")
  const userId = useAppSelector((state) => state.user.id)
  useEffect(() => {
    const init = async () => {
      setdiskStorageSet("connecting");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/terminal`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              projectId: projectId,
              userId: userId,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          showToast(false, "Failed to initialize project", data.details);
          setdiskStorageSet("error");
          return;
        }

        setdiskStorageSet("connected");
      } catch (err: any) {
        showToast(false, "Network error", err.message);
        setdiskStorageSet("error");
      }
    };

    init();
  }, []);

  if (diskStorageSet === "connecting" || diskStorageSet === "idle") {
    return <div className='w-full h-full flex items-center justify-center bg-secondary'>
      <NewLoader size={14} gap={12} />
    </div>;
  }
  if (diskStorageSet === "error") {
    return <div className='w-full h-full flex items-center justify-center bg-secondary'>
      <span className='py-3'>
        <X className='w-24 h-24 text-red-800' />
        <p className='text-red-700 text-lg font-semibold'>Failed to initialize project</p>
      </span>
    </div>;
  }
  return <div className='w-full h-full flex items-center justify-center bg-secondary'>
    <Terminal/>
  </div>;
}
export default Preview
