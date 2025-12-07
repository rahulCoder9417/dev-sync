"use client"
import { showToast } from '@/components/main/Toast'
import useTerminal from '@/customHooks/useTerminal'
import { useAppSelector } from '@/lib/redux/hooks'
import React, { useEffect, useState } from 'react'
import NewLoader from '@/components/main/SpiningLoader'
import { X } from 'lucide-react'
import Terminal from './Terminal'

const Preview = ({ projectId,terminalLoaded ,setTerminalLoaded}: { projectId: string,terminalLoaded:boolean,setTerminalLoaded:React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [diskStorageSet, setdiskStorageSet] = useState<"idle" | "connecting" | "connected" | "error">("idle")
  const userId = useAppSelector((state) => state.user.id)
  useEffect(() => {
    const init = async () => {
      setdiskStorageSet("connecting");
console.log(  `https${process.env.NEXT_PUBLIC_WS_URL_TERMINAL}/terminal/saveFile`)
      try {
        const res = await fetch(
          `https${process.env.NEXT_PUBLIC_WS_URL_TERMINAL}/api/terminal/saveFile`,
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
        setTerminalLoaded(true);
      } catch (err: any) {
        showToast(false, "Network error", err.message);
        console.log(err); 
        setdiskStorageSet("error");
      }
    };

   if(!terminalLoaded) init();
  }, [terminalLoaded]);

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
    <Terminal projectId={projectId}/>
  </div>;
}
export default Preview
