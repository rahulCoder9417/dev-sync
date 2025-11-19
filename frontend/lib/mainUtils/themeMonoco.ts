export const theme =  {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "c9d1d9", background: "0f1419" },  // default text + bg
      { token: "comment", foreground: "5c6370" },
      { token: "keyword", foreground: "82aaff", fontStyle: "bold" },
      { token: "identifier", foreground: "c9d1d9" },
      { token: "number", foreground: "ffcb6b" },
      { token: "string", foreground: "c3e88d" },
      { token: "delimiter", foreground: "89ddff" },
      { token: "type", foreground: "4dc9ff" },
      { token: "function", foreground: "82aaff" },
      { token: "operator", foreground: "89ddff" },
      { token: "variable", foreground: "c9d1d9" },
      { token: "constant", foreground: "ff5370" },
      { token: "class", foreground: "4fc1ff" },
      { token: "interface", foreground: "4fc1ff" },
      { token: "regexp", foreground: "c3e88d" },
  
      // Blueish gutter & line numbers
      { token: "line-number", foreground: "5d6b8c" },
    ],
    colors: {
      // Editor background
      "editor.background": "#0f1419",
  
      // Line number column
      "editorLineNumber.foreground": "#4b5563",
      "editorLineNumber.activeForeground": "#a7b4d6",
  
      // Cursor
      "editorCursor.foreground": "#4f89fc",
  
      // Selection
      "editor.selectionBackground": "#1e2b45",
      "editor.inactiveSelectionBackground": "#1b2334",
  
      // Highlight for find matches
      "editor.findMatchBackground": "#264f78",
      "editor.findMatchHighlightBackground": "#264f7844",
  
      // Line highlight
      "editor.lineHighlightBackground": "#1a1f2e66",
  
      // Gutter
      "editorGutter.background": "#0f1419",
  
      // Borders
      "editorWidget.border": "#374151",
      "editorSuggestWidget.border": "#374151",
  
      // Suggestion popup
      "editorSuggestWidget.background": "#1a1f2e",
      "editorSuggestWidget.foreground": "#e5e7eb",
  
      // Minimap
      "minimap.background": "#0f1419",
    }
  }
  