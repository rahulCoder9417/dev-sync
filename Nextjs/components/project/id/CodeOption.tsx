"use client"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTerminalOptions, TerminalType } from "@/lib/redux/features/terminalOptions";
import { RootState } from "@/lib/redux/store";

interface CodeOptionProps {
  projectId: string;
}

const TERMINAL_OPTIONS: TerminalType[] = ["server", "client", "browser"];

const CodeOption: React.FC<CodeOptionProps> = ({ projectId }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const currentOption =
    useSelector(
      (state: RootState) => state.terminalOptions.terminalOptions[projectId]
    ) ?? "server";

  const handleSelect = (option: TerminalType) => {
    dispatch(setTerminalOptions({ id: projectId, terminalOption: option }));
    setOpen(false);
  };

  useEffect(()=>{
    if(projectId){
      dispatch(setTerminalOptions({ id: projectId, terminalOption: "server" }));
    }
  },[projectId])

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Settings Button */}
      <button className="p-2 rounded-md hover:bg-[#2d3348] transition">
        ⚙️
      </button>

      {/* Tooltip / Popover */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-[#242937] border border-[#374151] rounded-lg shadow-lg z-50">
          <div className="px-3 py-2 text-sm text-[#94a3b8] border-b border-[#374151]">
            Terminal Mode
          </div>

          {TERMINAL_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2d3348] transition
                ${
                  currentOption === option
                    ? "text-[#4f89fc]"
                    : "text-white"
                }
              `}
            >
              {option}
              {currentOption === option && " ✓"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeOption;
