"use client"
import React, { useEffect, useState } from 'react';
import Header from '@/components/project/id/Header';
import FileExplorer from '@/components/project/id/fileExplorer/FileExplorer';
import CodeEditor from '@/components/project/id/CodeEditor';
import Preview from '@/components/project/id/Preview';
import ChatBot from '@/components/project/id/ChatBot';

import { ChatMessage, FileNode, ProjectById, Tab, User } from '@/types';
import Loader from '@/components/main/Loader';
import useCollab from '@/customHooks/useCollab';
import { DeleteToast } from './fileExplorer/DeleteToast';
export const mockUsers: any[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face',
    status: 'online'
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=32&h=32&fit=crop&crop=face',
    status: 'online'
  },
  {
    id: '3',
    name: 'Carol Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    status: 'away'
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    status: 'offline'
  }
];


   const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hello! How can I help you with your code today?',
    sender: 'bot',
    timestamp: "12:05"
  },
  {
    id: '2',
    text: 'I need help with React components',
    sender: 'user',
    timestamp: "12:05"
  },
  {
    id: '3',
    text: 'Id be happy to help! What specifically would you like to know about React components?',
    sender: 'bot',
    timestamp: "12:05"
  },
  {
    id: '4',
    text: 'How do I pass props between components?',
    sender: 'user',
    timestamp: "12:05"
  },
  {
    id: '5',
    text: 'Great question! You can pass props by adding attributes to your JSX elements. For example: ---',
    sender: 'bot',
    timestamp: "12:05"
  }
];

export const  ProjectCodeComp = ({data}:{data:ProjectById["responseData"]}) => {
  const [errorMarkers,setErrorMarkers] = useState<Record<string, boolean> | null>(null)
  const [files, setFiles] = useState<FileNode[]>(data?.files!);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [updatedTabs, setupdatedTabs] = useState<Record<string, string>[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [visibleSection, setVisibleSection] = useState<{file: boolean; code: boolean; ai: boolean; preview: boolean;}>({
    file: true,
    code: true,
    ai: false,
    preview: false
  });
  const [toggleOpen, setToggleOpen] = useState(false);

  const {join,status,sendMessage,participantsRef,deletionMenu,setdeletionMenu,leave} = useCollab({wsUrl:process.env.NEXT_PUBLIC_WS_URL!,})
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

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

  const handleFileSelect = (file:{content:string} & FileNode) => {
    if (file.type === 'file') {
      const existingTab = tabs.find(tab => tab.id === file.id);

      if (existingTab) {
        // Switch to existing tab
        setTabs(tabs.map(tab => ({
          ...tab,
          isActive: tab.id === file.id
        })));
      } else {
        // Create new tab
        const d= updatedTabs.find(tab => tab.id === file.id)?.content 
        const newTab: Tab = {
          id: file.id,
          name: file.name,
          type: 'file',
          content: d ||file.content || '',
          isActive: true,
          isDirty: false
        };

        setTabs([
          ...tabs.map(tab => ({ ...tab, isActive: false })),
          newTab
        ]);
      }
   join(data?.id!,file.id)
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
        join(data?.id!,newTabs[nextActiveIndex].id)
      }
    }else{
      leave(data?.id!,tabId)
    }

    setTabs(newTabs);
  };

  const handleTabSelect = (tabId: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
  };



  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: "12:05"
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I can help you with that! Let me analyze your code.",
        "That's a great question! Here's what I think...",
        "I see you're working on React components. Would you like some suggestions?",
        "Based on your code, I recommend using TypeScript interfaces for better type safety.",
        "Let me help you debug that issue. Can you show me the specific error?"
      ];

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot',
        timestamp: "12:05"
      };

      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  useEffect(()=>{
    console.log(status)
    if(status === "connected" && data){
      join(data.id)
      
    }
  },[status])
  if(!data)return <Loader/>
  return (
    <div className="h-screen bg-primary text-primary overflow-hidden w-full flex flex-col">
      {
        deletionMenu && (
          <DeleteToast
          
          confirm={()=>  sendMessage("vote_delete",data?.id!,deletionMenu.id,{fullName:deletionMenu.votingBy,fileName:deletionMenu.fileName})}
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
      <Header projectName={data.name} mockusers={data.team.members}  />

      <div className="flex-1 flex overflow-hidden">
        {visibleSection.file && (
          <div className="w-[15%] min-w-[200px]  max-md:w-1/2">
            <FileExplorer onTabClose={handleTabClose} errorMarkers={errorMarkers} particapantsRef={participantsRef.current} setdeletionMenu={setdeletionMenu}  sendMessage={sendMessage} files={files} setFiles={setFiles} projectId={data.id} tabs={tabs} setTabs={setTabs} onFileSelect={handleFileSelect} />
          </div>
        )}

        {visibleSection.code && (
          <div className="min-w-[35%] max-md:w-1/2 flex-1">
            <CodeEditor
            setFiles={setFiles}
            errorMarkers={errorMarkers}
            sendMessage={sendMessage}
            setErrorMarkers={setErrorMarkers}
            projectId={data.id}
            updatedTabs={updatedTabs}
            setupdatedTabs={setupdatedTabs}
              isTeam={data.isTeamMember!}
              tabs={tabs}
              setTabs={setTabs}
              onTabClose={handleTabClose}
              onTabSelect={handleTabSelect}
            />
          </div>
        )}

        {visibleSection.preview && (
          <div className="w-[25%] max-md:w-1/2">
            <Preview />
          </div>
        )}

        {(visibleSection.ai && data?.isTeamMember) && (
          <div className="w-[25%] max-md:w-1/2 min-w-[300px]">
            <ChatBot messages={chatMessages} onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>

      {/* Floating toggle control */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {toggleOpen && (
            <div className="absolute cursor-pointer bottom-14 right-0 flex flex-col items-end gap-2">
              {(data?.isTeamMember ?["file", "preview", "ai"]:["file","preview"]).map((section) => (
                <button
                  key={section}
                  onClick={() => toggleSection(section as keyof typeof visibleSection)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${visibleSection[section as keyof typeof visibleSection]
                    ? 'bg-green-500 text-white'
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

