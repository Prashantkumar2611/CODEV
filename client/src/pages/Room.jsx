import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";
import Output from "../components/Output";
import socket from "../socket";
import axios from "axios";

const LANGUAGES = [
  { id: "nodejs", name: "JavaScript" },
  { id: "python3", name: "Python"     },
  { id: "cpp", name: "C++"        },
  { id: "java", name: "Java"       },
];

export default function Room() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const username = state?.username || "Anonymous";

  const [code, setCode] = useState("// Start coding here\n");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [output, setOutput] = useState("");
  const [users, setUsers] = useState([]);
  const [running, setRunning] = useState(false);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    socket.connect();
    socket.emit("join-room", { roomId, username });

    // Receive current room state when joining
    socket.on("room-state", ({ code, language, users }) => {
      setCode(code);
      setUsers(users);
    });

    // Someone else typed
    socket.on("code-update", ({ code }) => {
      isRemoteUpdate.current = true;
      setCode(code);
    });

    // Someone joined
    socket.on("user-joined", ({ users }) => setUsers(users));

    // Someone left
    socket.on("user-left", ({ users }) => setUsers(users));

    // Language changed by someone else
    socket.on("language-update", ({ languageId }) => {
      const lang = LANGUAGES.find(l => l.id === languageId);
      if (lang) setLanguage(lang);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleCodeChange = (newCode) => {
    // Don't emit back if this was a remote update
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    setCode(newCode);
    socket.emit("code-change", { roomId, code: newCode });
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    socket.emit("language-change", {
      roomId,
      languageId: lang.id,
      languageName: lang.name
    });
  };

  const runCode = async () => {
    setRunning(true);
    setOutput("Running...");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/run-code`,
        { code, languageId: language.id }
      );
      setOutput(res.data.output);
    } catch {
      setOutput("Error running code.");
    }
    setRunning(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar users={users} roomId={roomId} />

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
          <select
            className="bg-gray-700 text-white p-2 rounded"
            value={language.id}
            onChange={(e) => {
              const lang = LANGUAGES.find(l => l.id === e.target.value);
              handleLanguageChange(lang);
            }}
          >
            {LANGUAGES.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <button
            onClick={runCode}
            disabled={running}
            className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded font-bold"
          >
            {running ? "Running..." : "▶ Run"}
          </button>
        </div>

        {/* Editor + Output */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Editor
              code={code}
              language={language.name.toLowerCase()}
              onChange={handleCodeChange}
            />
          </div>
          <Output output={output} />
        </div>
      </div>
    </div>
  );
}
