"use client"
import React, { useState } from 'react';
import Header from '@/components/project/id/Header';
import FileExplorer from '@/components/project/id/FileExplorer';
import CodeEditor from '@/components/project/id/CodeEditor';
import Preview from '@/components/project/id/Preview';
import ChatBot from '@/components/project/id/ChatBot';
import { ChatMessage, FileNode, Tab, User } from '@/lib/types';

export const mockUsers: User[] = [
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

export const mockFileStructure: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: '3',
            name: 'Header.tsx',
            type: 'file',
            content: 'import React from "react";\n\nconst Header = () => {\n  return <header>My App</header>;\n};\n\nexport default Header;',
            collaborators: ['1', '2']
          },
          {
            id: '4',
            name: 'Button.tsx',
            type: 'file',
            content: 'import React from "react";\n\ninterface ButtonProps {\n  children: React.ReactNode;\n  onClick?: () => void;\n}\n\nconst Button = ({ children, onClick }: ButtonProps) => {\n  return (\n    <button onClick={onClick}>\n      {children}\n    </button>\n  );\n};\n\nexport default Button;',
            collaborators: ['3']
          }
        ]
      },
      {
        id: '5',
        name: 'utils',
        type: 'folder',
        children: [
          {
            id: '6',
            name: 'helpers.ts',
            type: 'file',
            content: 'export const formatDate = (date: Date) => {\n  return date.toLocaleDateString();\n};\n\nexport const capitalize = (str: string) => {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n};',
            collaborators: ['1']
          }
        ]
      },
      {
        id: '7',
        name: 'App.tsx',
        type: 'file',
        content: 'import React from "react";\nimport Header from "./components/Header";\n\nfunction App() {\n  return (\n    <div className="App">\n      <Header />\n      <main>\n        <h1>Welcome to My App</h1>\n      </main>\n    </div>\n  );\n}\n\nexport default App;',
        collaborators: ['1', '2', '3']
      }
    ]
  },
  {
    id: '8',
    name: 'package.json',
    type: 'file',
    content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0",\n    "typescript": "^4.9.0"\n  }\n}',
    collaborators: ['4']
  }
];

export const mockTabs: Tab[] = [
  {
    id: '3',
    name: 'Header.tsx',
    type: 'file',
    content: 'import React from "react";\n\nconst Header = () => {\n  return <header>My App</header>;\n};\n\nexport default Header;',
    isActive: true,
    isDirty: false
  },
  {
    id: '7',
    name: 'App.tsx',
    type: 'file',
    content: 'import React from "react";\nimport Header from "./components/Header";\n\nfunction App() {\n  return (\n    <div className="App">\n      <Header />\n      <main>\n        <h1>Welcome to My App</h1>\n      </main>\n    </div>\n  );\n}\n\nexport default App;',
    isActive: false,
    isDirty: true
  }
];

export const mockChatMessages: ChatMessage[] = [
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
    text: 'I\'d be happy to help! What specifically would you like to know about React components?',
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
    text: 'Great question! You can pass props by adding attributes to your JSX elements. For example: <MyComponent name="John" age={25} />',
    sender: 'bot',
    timestamp: "12:05"
  }
];

const page = () => {
  const [tabs, setTabs] = useState<Tab[]>(mockTabs);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [visibleSection, setVisibleSection] = useState({
    file: true,
    code: true,
    ai: false,
    preview: false
  });
  const [toggleOpen, setToggleOpen] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const toggleSection = (key: keyof typeof visibleSection) => {
    const currentlyVisible = Object.entries(visibleSection).filter(([k, v]) => v);
    const isSelected = visibleSection[key];

    // Code editor is always visible
    if (key === 'code') return;

    if (isMobile) {
      const nonCodeVisible = currentlyVisible.filter(([k]) => k !== 'code');
      if (!isSelected && currentlyVisible.length > 1) return;
      if (isSelected && currentlyVisible.length <= 1) return;
    } else {
      if (!isSelected && currentlyVisible.length >= 4) return;
      if (isSelected && currentlyVisible.length <= 2) return;
    }

    setVisibleSection(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileSelect = (file: FileNode) => {
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
        const newTab: Tab = {
          id: file.id,
          name: file.name,
          type: 'file',
          content: file.content || '',
          isActive: true,
          isDirty: false
        };

        setTabs([
          ...tabs.map(tab => ({ ...tab, isActive: false })),
          newTab
        ]);
      }
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
      }
    }

    setTabs(newTabs);
  };

  const handleTabSelect = (tabId: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
  };

  const handleCodeChange = (tabId: string, content: string) => {
    setTabs(tabs.map(tab =>
      tab.id === tabId
        ? { ...tab, content, isDirty: content !== tab.content }
        : tab
    ));
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

  return (
    <div className="h-screen bg-primary text-primary w-full flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {visibleSection.file && (
          <div className="w-[15%] min-w-[200px] max-md:w-1/2">
            <FileExplorer files={mockFileStructure} onFileSelect={handleFileSelect} />
          </div>
        )}

        {visibleSection.code && (
          <div className="min-w-[35%] max-md:w-1/2 flex-1">
            <CodeEditor
              tabs={tabs}
              onTabClose={handleTabClose}
              onTabSelect={handleTabSelect}
              onCodeChange={handleCodeChange}
            />
          </div>
        )}

        {visibleSection.preview && (
          <div className="w-[25%] max-md:w-1/2">
            <Preview />
          </div>
        )}

        {visibleSection.ai && (
          <div className="w-[25%] max-md:w-1/2 min-w-[300px]">
            <ChatBot messages={chatMessages} onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>

      {/* Floating toggle control */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {toggleOpen && (
            <div className="absolute bottom-14 right-0 flex flex-col items-end gap-2">
              {["file", "preview", "ai"].map((section, index) => (
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
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
          >
            +
          </button>
        </div>
      </div>

    </div>
  );
};

export default page;