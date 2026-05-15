import MonacoEditor from "@monaco-editor/react";
import { useRef, useEffect } from "react";

export default function Editor({ code, language, onChange, roomId, socket, users, activeFile }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef(null); 

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Listen to local cursor movement and broadcast it
    editor.onDidChangeCursorPosition((e) => {
      if (socket && roomId && activeFile) {
        socket.emit("cursor-change", {
          roomId,
          filename: activeFile,
          position: e.position
        });
      }
    });
    
    // Initialize empty decorations collection for performance
    if (editor.createDecorationsCollection) {
      decorationsRef.current = editor.createDecorationsCollection([]);
    }
  };

  // Listen for remote cursors
  useEffect(() => {
    if (!socket || !editorRef.current || !monacoRef.current) return;

    // We store the current positions in a ref to persist across renders
    const remoteCursors = {};

    const updateDecorations = () => {
      if (!decorationsRef.current) return;
      const newDecorations = [];

      for (const [userId, cursorData] of Object.entries(remoteCursors)) {
        if (cursorData.filename !== activeFile) continue; // Only show cursor if they are on the same file!
        
        const user = users.find(u => u.id === userId);
        const position = cursorData.position;
        
        if (user && position) {
          const color = user.color || '#4ECDC4';
          
          const className = `remote-cursor-${userId}`;
          
          // Inject custom color style if it doesn't exist
          if (!document.getElementById(`style-${userId}`)) {
            const style = document.createElement('style');
            style.id = `style-${userId}`;
            style.innerHTML = `
              .${className} { 
                background-color: ${color} !important; 
                width: 2px !important; 
                position: absolute;
              }
              .${className}-tooltip { 
                background-color: ${color} !important; 
                color: #fff !important; 
                padding: 1px 6px !important; 
                border-radius: 4px !important; 
                font-size: 11px !important; 
                font-weight: bold !important;
                position: absolute !important; 
                top: -18px !important; 
                left: 0 !important; 
                white-space: nowrap !important; 
                z-index: 50 !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              }
            `;
            document.head.appendChild(style);
          }

          newDecorations.push({
            range: new monacoRef.current.Range(
              position.lineNumber, position.column,
              position.lineNumber, position.column
            ),
            options: {
              className: className,
              stickiness: 1, // TrackBeforeAndAfter
              before: {
                content: user.username,
                inlineClassName: `${className}-tooltip`,
              }
            }
          });
        }
      }
      decorationsRef.current.set(newDecorations);
    };

    const handleCursorUpdate = ({ userId, filename, position }) => {
      remoteCursors[userId] = { filename, position };
      updateDecorations();
    };

    const handleUserLeft = ({ users: updatedUsers }) => {
       const activeIds = updatedUsers.map(u => u.id);
       for (const id in remoteCursors) {
         if (!activeIds.includes(id)) {
           delete remoteCursors[id];
         }
       }
       updateDecorations();
    };

    socket.on('cursor-update', handleCursorUpdate);
    socket.on('user-left', handleUserLeft);

    return () => {
      socket.off('cursor-update', handleCursorUpdate);
      socket.off('user-left', handleUserLeft);
    };
  }, [socket, users, activeFile]);

  return (
    <MonacoEditor
      height="100%"
      language={language}
      value={code}
      theme="vs-dark"
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 16 }
      }}
    />
  );
}
