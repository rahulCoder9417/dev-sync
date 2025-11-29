// lib/utils/toast.ts
"use client";
import { toast } from "sonner";
import { CheckCircle, X, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import Avatar from "./Avatar";


export function showToast(success: boolean, message: string, description?: string,confimButton?:boolean,confirmButtonHandler?:() => void,buttonText?:string) {
  toast.custom((t) => (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border w-[360px] ${
        success
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="mt-0.5">
        {success ? (
          <CheckCircle className="text-green-600" size={24} />
        ) : (
          <XCircle className="text-red-600" size={24} />
        )}
      </div>

      <div className="flex-1">
        <p
          className={`font-semibold text-sm ${
            success ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {confimButton && (
        <Button onClick={() => confirmButtonHandler!()}>Confirm {buttonText}</Button>
      )}<button
          onClick={() => toast.dismiss(t)}
          className="text-muted-foreground hover:text-foreground transition text-xl leading-none"
        >
          ×
      </button>
    </div>
  ));
}

export type ChatToastType = {
  type: "chatToast";
  content: string;
  createdAt: Date;
  chatType: "team" | "direct";
  user: {
    userId: string;
    username: string;
    fullName: string;
    avatar?: string | null;
  };
};

export function showChatNotify({
  type,
  content,
  createdAt,
  chatType,
  user,
}: ChatToastType) {
  if (type !== "chatToast") return;

  toast.custom((t) => (
    <div
      className="flex items-start gap-3 p-4 rounded-xl shadow-lg border w-[360px] bg-primary dark:bg-neutral-900 border-border transition-all hover:scale-[1.02]"
    >
      {/* Avatar */}
      <Avatar fullName={user.fullName} avatar={user.avatar} />

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-primary truncate">
          Message By  {user.fullName}
            {chatType === "team" && (
              <span className="ml-1 text-[11px] text-blue-500 font-medium">(Team)</span>
            )}
          </p>
          <span className="text-[10px] text-muted-foreground">
            {new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Message Preview */}
        <p className="text-xs text-muted-foreground mt-1 truncate">{content}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => toast.dismiss(t)}
        className="text-muted-foreground hover:text-foreground transition text-xl leading-none"
      >
        ×
      </button>
    </div>
  ));
}
