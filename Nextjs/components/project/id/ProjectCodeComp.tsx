"use client"
import React, { useEffect, useState, useRef } from 'react';
import Header from '@/components/project/id/Header';
import FileExplorer from '@/components/project/id/CodeSidebar/fileExplorer/FileExplorer';
import CodeEditor from '@/components/project/id/CodeEditor';
import { useRouter } from "next/navigation";

import { ChatMessage, FileNode, OneOrNone, ProjectById, Tab, User } from '@/lib/types/types';
import Loader from '@/components/main/Loader';
import useCollab from '@/customHooks/useCollab';
import { DeleteToast } from './CodeSidebar/fileExplorer/DeleteToast';
import ChatComponent from '@/components/team/chatComponent';
import MainTerminal from './preview/MainTerminal';
import CodeSidebar from './CodeSidebar/CodeSidebar';
import SearchSidebar from './CodeSidebar/SearchSidebar/SearchSidebar';
import { useAppDispatch } from '@/lib/redux/hooks';
import { deleteProjectFiles, setInitialProjectFiles } from '@/lib/redux/features/projectFileSlice';
export const ProjectCodeComp = ({ data }: { data: ProjectById["responseData"] }) => {
  const [errorMarkers, setErrorMarkers] = useState<Record<string, boolean> | null>(null)
  const dispatch = useAppDispatch();
  const [terminalLoaded, setTerminalLoaded] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [canMakeChanges, setCanMakeChanges] = useState(true)
  const [visibleSection, setVisibleSection] = useState<{ file: boolean; code: boolean; chat: boolean; preview: boolean; }>({
    file: true,
    code: true,
    chat: false,
    preview: false
  });
  const [toggleOpen, setToggleOpen] = useState(false);

  // Resizing states
  const [fileWidth, setFileWidth] = useState(15); // percentage
  const [codeWidth, setCodeWidth] = useState(35); // percentage
  const [chatWidth, setChatWidth] = useState(25); // percentage
  const [previewWidth] = useState(25); // fixed percentage
  const router = useRouter()
  const isResizing = useRef<'file' | 'code' | 'chat' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { join, status, sendMessage, participantsRef, deletionMenu, setdeletionMenu, leave } = useCollab({ wsUrl: process.env.NEXT_PUBLIC_WS_URL!, autoConnect: (data?.isOwner || data?.isTeamMember) })
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const [sideBarOptions, setSideBarOptions] = useState<OneOrNone<{
    "explorer":boolean,
    "search":boolean,
    "git":boolean,
    "debug":boolean,
    "extension":boolean
  }>>({
    "explorer":true,
    "search":false,
    "git":false,
    "debug":false,
    "extension":false
  })
  const toggleSection = (key: keyof typeof visibleSection) => {
    const currentlyVisible = Object.entries(visibleSection).filter(([_, v]) => v);
    const isSelected = visibleSection[key];

    // Code editor is always visible
    if (key === 'code') return;

    if (isMobile) {
      if (!isSelected && currentlyVisible.length > 1) return;
      if (isSelected && currentlyVisible.length <= 1) return;
    } else {
      if (!isSelected && currentlyVisible.length >= 4) return;
      if (isSelected && currentlyVisible.length <= 2) return;
    }

    setVisibleSection(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileSelect = (file: { content: string } & Tab) => {
    if (file.type === 'file') {
      setTabs(prevTabs => {
        const existingTab = prevTabs.find(tab => tab.id === file.id);

        if (existingTab) {
          return prevTabs.map(tab => ({
            ...tab,
            isActive: tab.id === file.id
          }));
        }
        const newTab: Tab = {
          id: file.id,
          name: file.name,
          type: "file",
          content: file.content || "",
          isActive: true,
          isDirty: false
        };

        return [
          ...prevTabs.map(tab => ({ ...tab, isActive: false })),
          newTab
        ];
      });

      join(data?.id!, file.id)
    }
  };


  const handleTabClose = (tabId: string) => {

    const newTabs = tabs.filter(tab => tab.id !== tabId);

    if (newTabs.length > 0) {
      const closedTabIndex = tabs.findIndex(tab => tab.id === tabId);
      const wasActive = tabs[closedTabIndex]?.isActive;

      if (wasActive) {
        const nextActiveIndex = Math.min(closedTabIndex, newTabs.length - 1);
        newTabs[nextActiveIndex].isActive = true;
        join(data?.id!, newTabs[nextActiveIndex].id)
      }
    } else {
      leave(data?.id!, tabId)
    }

    setTabs(newTabs);
  };

  const handleTabSelect = (t: Tab) => {
    if (tabs.find(tab => (tab.id === t.id && tab.isActive))) {
      return
    }

    handleFileSelect(t)
  };

  // Resize handlers
  const handleMouseDown = (section: 'file' | 'code' | 'chat') => (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = section;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    const percentage = (mouseX / containerWidth) * 100;

    if (isResizing.current === 'file') {
      const newFileWidth = Math.min(Math.max(percentage, 10), 40);
      setFileWidth(newFileWidth);
    } else if (isResizing.current === 'code') {
      let totalLeft = 0;
      if (visibleSection.file) totalLeft += fileWidth;

      const relativePercentage = percentage - totalLeft;
      const newCodeWidth = Math.min(Math.max(relativePercentage, 20), 60);
      setCodeWidth(newCodeWidth);
    } else if (isResizing.current === 'chat') {
      const newChatWidth = Math.min(Math.max(100 - percentage, 15), 40);
      setChatWidth(newChatWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };
useEffect(() => {
  if (data&& data.id)  dispatch(setInitialProjectFiles({ projectId: data?.id!, files: data?.files! }));

  return () => {
    dispatch(deleteProjectFiles())
  }
}, [data])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [fileWidth, codeWidth, chatWidth, visibleSection]);


  useEffect(() => {
    if (data?.type === "PRIVATE" && !(data.isOwner || data.isTeamMember)) {
      // route to dashboard
      router.push("/dashboard")
    }
    setCanMakeChanges((data?.isOwner || data?.isTeamMember) as boolean)
    if (status === "connected" && data && (data.isOwner || data.isTeamMember)) {
      join(data.id)

    }
    return () => {
      if (data?.id && (data.isOwner || data.isTeamMember)) leave(data?.id!)
      if (data?.id && tabs[0]?.id && (data.isOwner || data.isTeamMember)) leave(data?.id!, tabs[0].id)
    }
  }, [status])
  if (!data) return <Loader />
  return (
    <div className="h-screen bg-primary text-primary overflow-hidden w-full flex flex-col">
      {
        deletionMenu && (
          <DeleteToast

            confirm={() => sendMessage("vote_delete", data?.id!, deletionMenu.id, { fullName: deletionMenu.votingBy, fileName: deletionMenu.fileName })}
            fileId={deletionMenu.id}
            fileName={deletionMenu.fileName}
            total={deletionMenu.required}
            done={deletionMenu.done}
            fullName={deletionMenu.votingBy}
            setdeletionMenu={setdeletionMenu}
            projectId={data.id}
          />
        )
      }
      <Header projectName={data.name} users={data.team.members} participantsRef={Array.from(participantsRef.current.keys())} isMember={data.isTeamMember || data.isOwner} projectId={data.id} />

      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Main SideBar */}
        <div className="max-md:w-0 w-12" >
         <CodeSidebar sideBarOptions={sideBarOptions} setSideBarOptions={setSideBarOptions} />
        </div>

        {visibleSection.file &&(Object.values(sideBarOptions).includes(true)) && (
          <>
            <div style={{ width: `${fileWidth}%`, minWidth: '200px' }} className="max-md:w-1/2">
            {sideBarOptions.explorer && (<FileExplorer canMakeChanges={canMakeChanges} onTabClose={handleTabClose} errorMarkers={errorMarkers} setdeletionMenu={setdeletionMenu} sendMessage={sendMessage} projectId={data.id} tabs={tabs} setTabs={setTabs} onFileSelect={handleFileSelect} />)}
            {sideBarOptions.search && <SearchSidebar />}
          
           </div>
            <div
              onMouseDown={handleMouseDown('file')}
              className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
            />
          </>
        )}

        {visibleSection.code && (
          <>
            <div style={{ width: `${codeWidth}%`, minWidth: '300px' }} className="max-md:w-1/2 flex-1">
              <CodeEditor
                errorMarkers={errorMarkers}
                sendMessage={sendMessage}
                setErrorMarkers={setErrorMarkers}
                projectId={data.id}
                isTeam={data.isTeamMember!}
                tabs={tabs}
                setTabs={setTabs}
                onTabClose={handleTabClose}
                onTabSelect={handleTabSelect}
              />
            </div>
            {(visibleSection.preview || visibleSection.chat) && (
              <div
                onMouseDown={handleMouseDown('code')}
                className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
              />
            )}
          </>
        )}

        {visibleSection.preview && (
          <>
            <div style={{ width: `${previewWidth}%` }} className="max-md:w-1/2">
              <MainTerminal projectName={data.name} setTerminalLoaded={setTerminalLoaded} terminalLoaded={terminalLoaded} projectId={data.id} />
            </div>
            {visibleSection.chat && (
              <div className="w-1 bg-gray-700 cursor-default" />
            )}
          </>
        )}

        {(visibleSection.chat && data?.isTeamMember) && (
          <>
            {!visibleSection.preview && (
              <div
                onMouseDown={handleMouseDown('chat')}
                className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
              />
            )}
            <div style={{ width: visibleSection.preview ? `${chatWidth}%` : `${chatWidth}%`, minWidth: '300px' }} className="max-md:w-1/2 ">
              {/* no use of last message */}
              <ChatComponent useInProjectPage={true} selectedChat={{ type: "team", id: data.team.id!, name: data.name }} dmAndTeam={{ teams: [{ id: data.team.id!, type: "team", lastMessageRead: false, name: data.name, memberCount: data.team.members.length, projectId: data.id, lastMessageAt: new Date(), }], friends: [] }} />
            </div>
          </>
        )}
      </div>

      {/* Floating toggle control */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {toggleOpen && (
            <div className="absolute cursor-pointer bottom-14 right-0 flex flex-col items-end gap-2">
              {(data?.isTeamMember ? ["file", "preview", "chat"] : ["file", "preview"]).map((section) => (
                <button
                  key={section}
                  onClick={() => toggleSection(section as keyof typeof visibleSection)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${visibleSection[section as keyof typeof visibleSection]
                    ? 'bg-secondary text-white'
                    : 'bg-gray-300 text-black'
                    }`}
                >
                  {section.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setToggleOpen(prev => !prev)}
            className="w-12 h-12 rounded-full cursor-pointer bg-blue-600 text-white flex items-center justify-center shadow-lg"
          >
            +
          </button>
        </div>
      </div>

    </div>
  );
};