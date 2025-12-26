"use client"
import dynamic from "next/dynamic";

const TerminalClient = dynamic(() => import("./Terminal"), {
  ssr: false,
});

type TerminalProps = {
  setIframeUrl?: (url: string) => void
  className?: string
  projectId?: string
  projectName?: string
}
export default function Terminal(props:TerminalProps) {
  return <TerminalClient {...props} />;
}
