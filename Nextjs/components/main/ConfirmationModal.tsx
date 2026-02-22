"use client"
import React from "react";
import { Button } from "../ui/button";

function ConfirmDialog({ message, onAccept, onCancel } : {message:string;onAccept:()=>void;onCancel:()=>void}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      {/* Dialog Box */}
      <div className="w-full max-w-sm rounded-lg bg-secondary p-6 shadow-xl
                      animate-in fade-in zoom-in duration-200">

        {/* Message */}
        <p className="mb-6 text-center text-primary text-base">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">

          <Button
            onClick={onCancel}
            variant={"destructive"}
          >
            Cancel
          </Button>

          <Button
            onClick={onAccept}
            
          >
            Confirm
          </Button>

        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;