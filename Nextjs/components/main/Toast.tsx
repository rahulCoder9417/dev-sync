// lib/utils/toast.ts
"use client";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import Avatar from "./Avatar";

export function showToast(
  success: boolean,
  message: string,
  description?: string,
  confirmButton?: boolean,
  confirmButtonHandler?: () => void,
  buttonText?: string
) {
  toast.custom((t) => (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border w-[360px] ${
        success
          ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {success ? (
          <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
        ) : (
          <XCircle className="text-red-600 dark:text-red-400" size={24} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-sm ${
            success 
              ? "text-green-800 dark:text-green-200" 
              : "text-red-800 dark:text-red-200"
          }`}
        >
          {message}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {confirmButton && confirmButtonHandler && (
          <Button 
            onClick={() => {
              confirmButtonHandler();
              toast.dismiss(t);
            }}
            size="sm"
            className="mt-2"
          >
            {buttonText || "Confirm"}
          </Button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => toast.dismiss(t)}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
        aria-label="Close notification"
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
    <div className="flex items-start gap-3 p-4 rounded-xl shadow-lg border w-[360px] bg-background border-border transition-all hover:scale-[1.02] cursor-pointer">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar fullName={user.fullName} avatar={user.avatar} />
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-sm text-foreground truncate flex-1">
            {user.fullName}
            {chatType === "team" && (
              <span className="ml-1.5 text-[11px] text-blue-500 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                Team
              </span>
            )}
          </p>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Message Preview */}
        <p className="text-xs text-muted-foreground line-clamp-2">{content}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(t);
        }}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  ));
}