// lib/utils/toast.ts
"use client";

import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";


export function showToast(success: boolean, message: string, description?: string) {
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

      <button
        onClick={() => toast.dismiss(t)}
        className="text-muted-foreground hover:text-foreground transition text-xl leading-none"
      >
        ×
      </button>
    </div>
  ));
}
