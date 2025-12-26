"use client"
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import ChatComponent from "../team/chatComponent";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateChatPopUp } from "@/lib/redux/features/chatPopUpSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import getDMAndTeam from "@/lib/actions/chat/dmAndTeam";
import { DMAndTeamResult } from "@/lib/types/chat";

export function ChatPopup() {
    
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const chat = useAppSelector((state) => state.chatPopUp);
    const dispatch = useAppDispatch();
    const [messageData, setMessageData] = useState<DMAndTeamResult >({teams:[],friends:[]})
    useEffect(() => {
      async function  getData(){
        try {
           let  data = await getDMAndTeam()
            data?.teams.sort((a, b) => {
              const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
              const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
              return bTime - aTime; // most recent first
            });
            data?.friends.sort((a, b) => {
              const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
              const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
              return bTime - aTime; // most recent first
            });
            setMessageData(data)

        } catch (error) {
          console.log(error)
        }
      }
      getData()
    }, []);
    if (!chat.isOpen) return null;

    return createPortal(
        <div
            className="fixed border border-gray-300 rounded-lg   overflow-auto z-[9999]"
            style={{
                top: position.y,
                left: position.x,
                width: "400px",
                height: "500px",
            }}
        >
            {/* Header / draggable area */}
            <div
                className="flex justify-between items-center cursor-grab p-2  bg-primary border-b border-gray-200 "
                onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startPos = { ...position };

                    const onMouseMove = (moveEvent: MouseEvent) => {
                        setPosition({
                            x: startPos.x + moveEvent.clientX - startX,
                            y: startPos.y + moveEvent.clientY - startY,
                        });
                    };

                    const onMouseUp = () => {
                        document.removeEventListener("mousemove", onMouseMove);
                        document.removeEventListener("mouseup", onMouseUp);
                    };

                    document.addEventListener("mousemove", onMouseMove);
                    document.addEventListener("mouseup", onMouseUp);
                }}
            >
                <Button
                    variant="ghost"
                    onClick={() =>
                        dispatch(updateChatPopUp({ isOpen: false, selectedChat: null }))
                    }
                >
                    <X />
                </Button>
                <Select
            
                    value={
                        chat.selectedChat
                            ? chat.selectedChat.type === "team"
                                ? "team"
                                : chat.selectedChat.type === "direct"
                                    ? `direct-${chat.selectedChat.id}`
                                        : undefined
                            : undefined
                    }
                    onValueChange={(value) => {
                        let selectedChat: { type: 'team' | 'direct'; id: string; name: string } | null = null;
                        if (value.startsWith("team-")) {
                            const team = messageData?.teams.find((t) => t.id === value.split("-")[1]);
                            if (team) selectedChat = { type: "team", id: team.id, name: team.name };
                        } else if (value.startsWith("direct-")) {
                            const user = messageData?.friends.find((u) => u.id === value.split("-")[1]);
                            if (user) selectedChat = { type: "direct", id: user.id, name: user.fullName };
                        }

                        if (selectedChat) {
                            dispatch(updateChatPopUp({ isOpen: true, selectedChat }));
                        }
                    }}
                >
                    <SelectTrigger className="w-[180px] text-primary truncate">
                        <SelectValue placeholder="Select a chat" />
                    </SelectTrigger>
                    <SelectContent className="z-[10000] bg-secondary text-primary truncate">
                        <SelectItem value="global">Global Chat</SelectItem>
                        {   messageData?.teams.map((t) => (
                            <SelectItem key={t.id} value={`team-${t.id}`}>
                                {t.name} (Team)
                            </SelectItem>
                        ))}
                        {messageData?.friends.map((u) => (
                            <SelectItem key={u.id} value={`direct-${u.id}`}>
                                {u.fullName} (Direct)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


            </div>

            {/* Chat area */}
            <div className="h-[calc(100%-40px)]">
      {chat.selectedChat && <ChatComponent dmAndTeam={messageData
      } selectedChat={chat.selectedChat} />}
            </div>
        </div>,
        document.body
    );
}
