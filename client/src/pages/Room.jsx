import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";
import Output from "../components/Output";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const LANGUAGES = [
  { id: "nodejs", name: "javascript" },
  { id: "python3", name: "python"     },
  { id: "cpp", name: "cpp"        },
  { id: "java", name: "java"       },
  { id: "html", name: "html" },
  { id: "css", name: "css" }
];

export default function Room() {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const username = user?.username || "Anonymous";

  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [output, setOutput] = useState("");
  const [users, setUsers] = useState([]);
  const [running, setRunning] = useState(false);
  const isRemoteUpdate = useRef(false);
  const activeFileRef = useRef(activeFile);
  
  useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  const isProject = roomId && roomId.length === 24;

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      socket.emit("join-room", { roomId, username, token: user?.token });
    };

    if (socket.connected) {
      handleConnect();
    }
    
    socket.on("connect", handleConnect);

    // Receive current room state when joining
    socket.on("room-state", ({ files, users }) => {
      setFiles(files);
      setUsers(users);
      if (Object.keys(files).length > 0) {
        const defaultFile = Object.keys(files)[0];
        setActiveFile(prev => {
          if (!prev || !files[prev]) {
            socket.emit("active-file-change", { roomId, filename: defaultFile });
            return defaultFile;
          }
          return prev;
        });
      }
    });

    // Someone else typed in a file
    socket.on("code-update", ({ filename, code }) => {
      setFiles(prev => {
        // If the update is for the file we are currently looking at, block local echo
        if (filename === activeFileRef.current) {
          isRemoteUpdate.current = true;
        }
        return {
          ...prev,
          [filename]: { ...prev[filename], code }
        };
      });
    });

    socket.on("file-created", ({ filename, language, creator }) => {
      setFiles(prev => ({
        ...prev,
        [filename]: { code: "", language, creator }
      }));
    });

    socket.on("file-deleted", ({ filename }) => {
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[filename];
        
        setActiveFile(prevActive => {
          if (prevActive === filename) {
            const remaining = Object.keys(newFiles);
            return remaining.length > 0 ? remaining[0] : "";
          }
          return prevActive;
        });

        return newFiles;
      });
    });

    socket.on("language-change", ({ filename, language }) => {
      setFiles(prev => {
        if (!prev[filename]) return prev;
        return {
          ...prev,
          [filename]: { ...prev[filename], language }
        };
      });
    });

    // Users update
    socket.on("user-joined", ({ users }) => setUsers(users));
    socket.on("user-left", ({ users }) => setUsers(users));

    return () => {
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [roomId, username]); 

  const handleCodeChange = (newCode) => {
    // Don't emit back if this was a remote update
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    
    setFiles(prev => ({
      ...prev,
      [activeFile]: { ...prev[activeFile], code: newCode }
    }));
    
    socket.emit("code-change", { roomId, filename: activeFile, code: newCode });
  };

  const handleFileSelect = (filename) => {
    setActiveFile(filename);
    socket.emit("active-file-change", { roomId, filename });
  };

  const handleAddFile = () => {
    const filename = prompt("Enter new filename (e.g., script.js, utils.py):");
    if (!filename || filename.trim() === "") return;
    if (files[filename]) {
      alert("File already exists!");
      return;
    }
    
    let ext = filename.split('.').pop().toLowerCase();
    let language = "javascript";
    if (ext === "py") language = "python";
    if (ext === "cpp") language = "cpp";
    if (ext === "java") language = "java";
    if (ext === "html") language = "html";
    if (ext === "css") language = "css";

    socket.emit("create-file", { roomId, filename, language });
    
    // Optimistically update local state
    setFiles(prev => ({
      ...prev,
      [filename]: { code: "", language, creator: username }
    }));
    handleFileSelect(filename);
  };

  const handleDeleteFile = (filename) => {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      socket.emit("delete-file", { roomId, filename });
      
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[filename];
        
        if (activeFile === filename) {
          const remaining = Object.keys(newFiles);
          handleFileSelect(remaining.length > 0 ? remaining[0] : "");
        }

        return newFiles;
      });
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    socket.emit("language-change", { roomId, filename: activeFile, language: newLang });
    setFiles(prev => ({
      ...prev,
      [activeFile]: { ...prev[activeFile], language: newLang }
    }));
  };

  const activeFileData = files[activeFile] || { code: "// Loading...", language: "javascript", creator: null };
  const isReadOnly = isProject && activeFileData.creator && activeFileData.creator !== username;

  const runCode = async () => {
    setRunning(true);
    setOutput(`Running ${activeFile}...`);
    try {
      // JDoodle specific mapping
      let languageId = activeFileData.language;
      if (languageId === "javascript") languageId = "nodejs";
      if (languageId === "python") languageId = "python3";
      
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL || ''}/run-code`,
        { code: activeFileData.code, languageId }
      );
      setOutput(res.data.output);
    } catch {
      setOutput("Error running code.");
    }
    setRunning(false);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Sidebar 
        users={users} 
        roomId={roomId} 
        files={files} 
        activeFile={activeFile} 
        onFileSelect={handleFileSelect} 
        onAddFile={handleAddFile}
        onDeleteFile={handleDeleteFile}
        isProject={isProject}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between p-3.5 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            {isProject && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-300 font-semibold text-sm">{activeFile}</span>
                {isReadOnly && (
                  <span className="bg-red-950/20 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-900/30 flex items-center gap-1" title={`Owned by ${activeFileData.creator}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Read-Only
                  </span>
                )}
              </div>
            )}
            <select
              value={activeFileData.language}
              onChange={handleLanguageChange}
              disabled={isReadOnly}
              className="bg-zinc-950 text-zinc-300 text-xs px-3 py-1.5 rounded-lg border border-zinc-800 uppercase outline-none focus:border-orange-500/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <option value="javascript">JavaScript (Node)</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-355 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              )}
            </button>

            <button
              onClick={runCode}
              disabled={running}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-1.5 rounded-lg font-bold shadow-lg shadow-orange-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm"
            >
              {running ? "Running..." : "▶ Run"}
            </button>
          </div>
        </div>

        {/* Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden bg-zinc-950">
            {activeFile ? (
              <Editor
                code={activeFileData.code}
                language={activeFileData.language}
                onChange={handleCodeChange}
                roomId={roomId}
                socket={socket}
                users={users}
                activeFile={activeFile}
                isReadOnly={isReadOnly}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-600 font-mono text-sm">
                // Select a file to start coding
              </div>
            )}
          </div>
          <Output output={output} />
        </div>
      </div>
    </div>
  );
}
