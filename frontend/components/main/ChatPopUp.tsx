"use client"
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import ChatComponent from "../team/chatComponent";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateChatPopUp } from "@/lib/redux/features/chatPopUpSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { users, teams, currentUser, User } from '../../app/team/page'
export function ChatPopup() {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const chat = useAppSelector((state) => state.chat);
    const dispatch = useAppDispatch();
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
                            ? chat.selectedChat.type === "global"
                                ? "global"
                                : chat.selectedChat.type === "team"
                                    ? `team-${chat.selectedChat.id}`
                                    : chat.selectedChat.type === "direct"
                                        ? `direct-${chat.selectedChat.id}`
                                        : undefined
                            : undefined
                    }
                    onValueChange={(value) => {
                        let selectedChat: { type: 'global' | 'team' | 'direct'; id?: string; name: string } | null = null;
                        if (value === "global") {
                            selectedChat = { type: "global", name: "Global Chat" };
                        } else if (value.startsWith("team-")) {
                            const team = teams.find((t) => t.id === value.split("-")[1]);
                            if (team) selectedChat = { type: "team", id: team.id, name: team.name };
                        } else if (value.startsWith("direct-")) {
                            const user = users.find((u) => u.id === value.split("-")[1]);
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
                        {teams.map((t) => (
                            <SelectItem key={t.id} value={`team-${t.id}`}>
                                {t.name} (Team)
                            </SelectItem>
                        ))}
                        {users.map((u) => (
                            <SelectItem key={u.id} value={`direct-${u.id}`}>
                                {u.fullName} (Direct)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


            </div>

            {/* Chat area */}
            <div className="h-[calc(100%-40px)]">
      {chat.selectedChat && <ChatComponent selectedChat={chat.selectedChat} />}
            </div>
        </div>,
        document.body
    );
}
