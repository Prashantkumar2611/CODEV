import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";
import Output from "../components/Output";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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
  const username = user?.username || "Anonymous";

  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [output, setOutput] = useState("");
  const [users, setUsers] = useState([]);
  const [running, setRunning] = useState(false);
  const isRemoteUpdate = useRef(false);
  
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
        setActiveFile(defaultFile);
        socket.emit("active-file-change", { roomId, filename: defaultFile });
      }
    });

    // Someone else typed in a file
    socket.on("code-update", ({ filename, code }) => {
      setFiles(prev => {
        // If the update is for the file we are currently looking at, block local echo
        if (filename === activeFile) {
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
        return newFiles;
      });
      setActiveFile(prevActive => {
        if (prevActive === filename) {
          return "main.js"; // Fallback to main.js if active file deleted
        }
        return prevActive;
      });
    });

    // Users update
    socket.on("user-joined", ({ users }) => setUsers(users));
    socket.on("user-left", ({ users }) => setUsers(users));

    return () => {
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [roomId, username, activeFile]); // activeFile in dependency so closure gets latest for isRemoteUpdate logic

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
        return newFiles;
      });
      
      if (activeFile === filename) {
        handleFileSelect("main.js"); // Fallback to main.js
      }
    }
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
    <div className="flex h-screen bg-gray-900 text-white">
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

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-4">
            {isProject && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">{activeFile}</span>
                {isReadOnly && (
                  <span className="bg-red-900/50 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-800 flex items-center gap-1" title={`Owned by ${activeFileData.creator}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Read-Only
                  </span>
                )}
              </div>
            )}
            <span className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-300 uppercase">
              {activeFileData.language}
            </span>
          </div>

          <button
            onClick={runCode}
            disabled={running}
            className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded font-bold shadow-lg shadow-green-600/20"
          >
            {running ? "Running..." : "▶ Run"}
          </button>
        </div>

        {/* Editor + Output */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
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
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a file to start coding
              </div>
            )}
          </div>
          <Output output={output} />
        </div>
      </div>
    </div>
  );
}
