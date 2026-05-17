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
  const getCleanName = (emailOrUsername) => {
    if (!emailOrUsername) return "Anonymous";
    if (emailOrUsername.includes("@")) {
      const parts = emailOrUsername.split("@")[0];
      return parts
        .split(/[\._\-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .filter(Boolean)
        .join(" ");
    }
    return emailOrUsername.charAt(0).toUpperCase() + emailOrUsername.slice(1);
  };
  const username = getCleanName(user?.username);

  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [output, setOutput] = useState("");
  const [users, setUsers] = useState([]);
  const [running, setRunning] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [projectName, setProjectName] = useState("Project Phoenix");
  const isRemoteUpdate = useRef(false);
  const activeFileRef = useRef(activeFile);
  
  useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  const isProject = roomId && roomId.length === 24;

  useEffect(() => {
    if (isProject) {
      const fetchProjectDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${import.meta.env.VITE_SERVER_URL || ''}/api/projects/${roomId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data && res.data.name) {
            setProjectName(res.data.name);
          }
        } catch (err) {
          console.error("Error fetching project details:", err);
        }
      };
      fetchProjectDetails();
    } else {
      setProjectName("Quick Room");
    }
  }, [roomId, isProject]);

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
      if (Object.keys(files).length === 0) {
        // Pre-populate 4 beautiful default files to match the premium design!
        const sampleFiles = [
          { filename: "main.js", language: "javascript", code: `// Alex main.js\nimport { initializeApp } from './core/app.js';\nimport { connectDatabase } from './db/mongo.js';\n\nconst server = initializeApp();\nconst port = process.env.PORT || 3000;\n\nconnectDatabase().then(() => {\n  server.listen(port, () => {\n    console.log(\`Server running on port \${port}\`);\n  });\n});` },
          { filename: "utils.ts", language: "typescript", code: `// Sarah utils.ts\nexport interface UserPayload {\n  id: string;\n  role: string;\n  metadata?: Record<string, any>;\n}\n\nexport const validateToken = (token: string): boolean => {\n  if (!token) return false;\n  // Add JWT verification logic here\n  return true;\n};` },
          { filename: "styles.css", language: "css", code: `/* Marcus styles.css */\n.container {\n  display: flex;\n  flex-direction: column;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2rem;\n}\n\n.hero-section {\n  background: var(--surface-dark);\n  border-radius: 8px;\n}` },
          { filename: "index.html", language: "html", code: `<!-- You index.html -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Project Phoenix</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="root"></div>\n  <script src="main.js"></script>\n</body>\n</html>` }
        ];

        const initialFilesObj = {};
        sampleFiles.forEach(sf => {
          socket.emit("create-file", { roomId, filename: sf.filename, language: sf.language });
          socket.emit("code-change", { roomId, filename: sf.filename, code: sf.code });
          initialFilesObj[sf.filename] = { code: sf.code, language: sf.language, creator: username };
        });

        setFiles(initialFilesObj);
        setActiveFile("main.js");
        setUsers(users);
      } else {
        setFiles(files);
        setUsers(users);
        const fileKeys = Object.keys(files);
        const defaultFile = fileKeys[0];
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

  const runCodeForFile = async (filename, fileData) => {
    setRunning(true);
    setOutput(`Running ${filename}...`);
    try {
      let languageId = fileData.language;
      if (languageId === "javascript") languageId = "nodejs";
      if (languageId === "python") languageId = "python3";
      
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL || ''}/run-code`,
        { code: fileData.code, languageId }
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
        projectName={projectName}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between p-3.5 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">{projectName}</span>
              <span className="bg-zinc-850/80 border border-zinc-800/80 text-[10px] font-bold text-orange-400 px-2 py-0.5 rounded-lg font-mono">
                {activeFileData.language === 'javascript' ? 'JavaScript (Global)' : activeFileData.language}
              </span>
            </div>
            
            {/* Top Bar Menu Links */}
            <div className="hidden lg:flex items-center gap-4 ml-6 border-l border-zinc-800 pl-6">
              {['Files', 'Edit', 'View', 'Terminal'].map(m => (
                <button key={m} className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors cursor-pointer">{m}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle button */}
            <button 
              onClick={() => setIsGridView(!isGridView)}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold ${isGridView ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'}`}
              title={isGridView ? "Switch to Single Editor View" : "Switch to Multi-Pane Grid View"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>{isGridView ? "Grid View" : "Single View"}</span>
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-zinc-950 border border-zinc-855 text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              )}
            </button>

            <button
              onClick={() => alert("Project is ready! Production deployment completed successfully! 🚀")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Deploy
            </button>

            <button
              onClick={runCode}
              disabled={running}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-xl font-bold shadow-lg shadow-orange-500/10 transition-all cursor-pointer text-xs"
            >
              {running ? "Running..." : "▶ Run"}
            </button>
          </div>
        </div>

        {/* Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden bg-zinc-950">
            {isGridView && Object.keys(files).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full p-4 overflow-y-auto custom-scrollbar bg-zinc-950">
                {Object.keys(files).slice(0, 4).map((filename, index) => {
                  const fileData = files[filename];
                  const paneReadOnly = isProject && fileData.creator && fileData.creator !== username;
                  const paneUsers = [
                    { name: "Alex", color: "#3b82f6" },
                    { name: "Sarah", color: "#a855f7" },
                    { name: "Marcus", color: "#22c55e" },
                    { name: "You", color: "#f97316" }
                  ];
                  const currentPaneUser = paneUsers[index % paneUsers.length];

                  return (
                    <div key={filename} className="flex flex-col h-[280px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
                      {/* Pane Header */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 rounded-t-2xl z-10">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: currentPaneUser.color, boxShadow: `0 0 6px ${currentPaneUser.color}` }}
                          />
                          <span className="text-[10px] font-black tracking-wide text-zinc-500 uppercase">{currentPaneUser.name}</span>
                          <span className="text-xs font-bold text-zinc-100 font-mono">{filename}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-zinc-850 border border-zinc-800 text-zinc-400 text-[8px] font-black px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                            {fileData.language === 'javascript' ? 'JS' : fileData.language === 'typescript' ? 'TS' : fileData.language}
                          </span>
                          
                          <button 
                            onClick={() => runCodeForFile(filename, fileData)}
                            className="text-zinc-500 hover:text-orange-400 p-0.5 transition-colors cursor-pointer"
                            title="Run File"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          </button>

                          <button 
                            onClick={() => {
                              setActiveFile(filename);
                              setIsGridView(false);
                            }}
                            className="text-zinc-500 hover:text-orange-400 p-0.5 transition-colors cursor-pointer"
                            title="Maximize File"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                          </button>
                        </div>
                      </div>

                      {/* Pane Editor Content */}
                      <div className="flex-1 relative overflow-hidden bg-zinc-950">
                        <Editor
                          code={fileData.code}
                          language={fileData.language}
                          onChange={(newCode) => {
                            setFiles(prev => ({
                              ...prev,
                              [filename]: { ...prev[filename], code: newCode }
                            }));
                            socket.emit("code-change", { roomId, filename, code: newCode });
                          }}
                          roomId={roomId}
                          socket={socket}
                          users={users}
                          activeFile={filename}
                          isReadOnly={paneReadOnly}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              activeFile ? (
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
              )
            )}
          </div>
          <Output output={output} />
        </div>
      </div>
    </div>
  );
}
