"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AGENT_LIST, TOOL_CATEGORIES, ConnectionStatus, ConversationMessage, AgentResponse, OverlayData } from "@/types";
import { getWebSocket } from "@/lib/websocket";
import { ScreenShareManager } from "@/lib/screenShare";

export default function ConsolePage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [agentActivity, setAgentActivity] = useState<string>("Waiting for connection...");
  const [activeAgent, setActiveAgent] = useState<string>("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [overlays, setOverlays] = useState<OverlayData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const screenShareRef = useRef<ScreenShareManager | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef(getWebSocket());
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Connect WebSocket
  useEffect(() => {
    const ws = wsRef.current;

    const unsubs = [
      ws.on("status", (msg) => {
        const s = msg.data.status as ConnectionStatus;
        setConnectionStatus(s);
        if (s === "connected") setAgentActivity("LUMEN online. Ready for commands.");
      }),
      ws.on("agent_activity", (msg) => {
        setAgentActivity(msg.data.message as string);
        setActiveAgent(msg.data.agent as string);
      }),
      ws.on("agent_response", (msg) => {
        const data = msg.data as unknown as AgentResponse;
        setAgentActivity(`${data.agent}: Response delivered`);
        setActiveAgent(data.agent);
        setConversation((prev) => [...prev, { role: "agent", content: data.response, agent: data.agent, timestamp: msg.timestamp }]);
        if (data.tool_result?.overlay) {
          setOverlays((prev) => {
            const existing = prev.findIndex((o) => o.type === (data.tool_result!.overlay as OverlayData).type);
            const newOverlay = data.tool_result!.overlay as OverlayData;
            if (existing >= 0) { const updated = [...prev]; updated[existing] = newOverlay; return updated; }
            return [...prev, newOverlay];
          });
        }
        if (data.tool_result?.action === "hide_overlay") {
          setOverlays((prev) => prev.filter((o) => o.type !== data.tool_result!.overlay_type));
        }
        if (data.tool_result?.action === "hide_all") setOverlays([]);
      }),
      ws.on("tool_result", (msg) => {
        const result = msg.data.result as Record<string, unknown>;
        if (result?.overlay) {
          setOverlays((prev) => {
            const overlay = result.overlay as OverlayData;
            const existing = prev.findIndex((o) => o.type === overlay.type);
            if (existing >= 0) { const updated = [...prev]; updated[existing] = overlay; return updated; }
            return [...prev, overlay];
          });
        }
      }),
    ];

    ws.connect();
    return () => { unsubs.forEach((u) => u()); };
  }, []);

  // Auto-scroll conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Send voice command
  const sendCommand = useCallback((text: string) => {
    if (!text.trim()) return;
    const ws = wsRef.current;
    setConversation((prev) => [...prev, { role: "user", content: text, timestamp: new Date().toISOString() }]);
    ws.sendVoiceCommand(text);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
          setAgentActivity("Listening...");
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error !== "no-speech") {
            setAgentActivity(`Speech recognition error: ${event.error}`);
          } else {
            setAgentActivity("No speech detected. Try again.");
          }
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript.trim()) {
            sendCommand(transcript);
            setAgentActivity(`Voice command sent: "${transcript}"`);
          }
        };

        setRecognition(rec);
      }
    }
  }, [sendCommand]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  }, [recognition, isListening]);

  // Screen share toggle
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      screenShareRef.current?.stop();
      setIsScreenSharing(false);
      if (videoRef.current) videoRef.current.srcObject = null;
      wsRef.current.sendToolCall("stop_screen_share");
      return;
    }
    try {
      if (!screenShareRef.current) screenShareRef.current = new ScreenShareManager();
      const stream = await screenShareRef.current.start((base64) => {
        wsRef.current.sendScreenFrame(base64);
      }, 1);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsScreenSharing(true);
      wsRef.current.sendToolCall("start_screen_share");
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  }, [isScreenSharing]);

  // Tool click
  const handleToolClick = useCallback((tool: string) => {
    wsRef.current.sendToolCall(tool);
  }, []);

  const statusColor = connectionStatus === "connected" ? "bg-emerald-500" : connectionStatus === "connecting" ? "bg-amber-500" : "bg-slate-400";

  return (
    <div className="h-screen flex bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* ─── Main View ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video / Screen Share Area */}
        <div className="flex-1 relative bg-slate-100/50 flex items-center justify-center overflow-hidden">
          {isScreenSharing ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
          ) : (
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white border border-slate-200/80 shadow-sm flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm mb-4">No screen shared</p>
              <button onClick={toggleScreenShare} className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98] text-sm">
                Start Screen Share
              </button>
            </div>
          )}

          {/* Overlays */}
          {overlays.map((overlay) => (
            <div key={overlay.type} className={`absolute p-4 max-w-sm glass-light shadow-xl border border-slate-200/50 rounded-2xl text-sm ${
              overlay.position === "top-left" ? "top-4 left-4" :
              overlay.position === "top-right" ? "top-4 right-4" :
              overlay.position === "bottom-left" ? "bottom-4 left-4" :
              overlay.position === "bottom-right" ? "bottom-4 right-4" :
              "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            }`}>
              <div className="flex items-center justify-between mb-2 gap-4">
                <h4 className="text-xs font-bold text-sky-600 uppercase tracking-wider">{overlay.title}</h4>
                <button onClick={() => setOverlays((prev) => prev.filter((o) => o.type !== overlay.type))} className="text-slate-400 hover:text-slate-600 text-xs transition-colors">✕</button>
              </div>
              <pre className="text-xs text-slate-600 bg-slate-50/80 border border-slate-100 p-3 rounded-xl whitespace-pre-wrap overflow-auto max-h-48 font-mono">
                {JSON.stringify(overlay.content, null, 2)}
              </pre>
            </div>
          ))}

          {/* Bottom toolbar */}
          {isScreenSharing && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-100/50 to-transparent p-4">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/90 border border-slate-200/80 shadow-sm rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-medium text-slate-600">Screen sharing active</span>
                </div>
                <button onClick={toggleScreenShare} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-medium transition-all shadow-sm active:scale-95">
                  Stop Sharing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Sidebar ────────────────────────────────────────────── */}
      <div className={`${sidebarOpen ? "w-72" : "w-0"} transition-all duration-300 border-l border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm`}>
        {/* Voice Orb */}
        <div className="p-4 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${isListening ? "from-red-500/20 to-rose-500/20 orb-pulse" : connectionStatus === "connected" ? "from-sky-400/20 to-cyan-400/20 orb-pulse" : "from-slate-200/20 to-slate-300/20"}`} />
            <button
              onClick={toggleListening}
              disabled={connectionStatus !== "connected"}
              className={`absolute inset-2 rounded-full bg-gradient-to-br ${
                isListening
                  ? "from-red-500 to-rose-600 text-white border-red-400 shadow-md scale-95 orb-active-red"
                  : connectionStatus === "connected"
                  ? "from-white to-slate-50 hover:to-slate-100/50 border-sky-300 hover:border-sky-400 text-sky-600 shadow-sm active:scale-95 orb-active"
                  : "from-slate-100 to-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
              } border flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none`}
            >
              <svg className={`w-6 h-6 ${isListening ? "text-white" : connectionStatus === "connected" ? "text-sky-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
          <p className={`text-[10px] font-bold tracking-widest ${isListening ? "text-red-500 animate-pulse" : connectionStatus === "connected" ? "text-sky-600" : "text-slate-400"} uppercase mt-2`}>
            {isListening
              ? "LISTENING... TAP TO STOP"
              : connectionStatus === "connected"
              ? "LUMEN ONLINE. TAP TO SPEAK."
              : connectionStatus === "connecting"
              ? "LUMEN CONNECTING..."
              : "LUMEN OFFLINE."}
          </p>
        </div>

        {/* Agents & Tools */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar p-4 bg-white">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
              Agents & Tools
            </h3>

            {/* Agents */}
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">Agents</p>
              <div className="space-y-1">
                {AGENT_LIST.filter((a) => a.id === "orchestrator").map((a) => (
                  <div key={a.id} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-default transition-all ${activeAgent === a.id ? "bg-sky-50 text-sky-600 border border-sky-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"}`}>
                    {a.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol */}
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-widest text-sky-600 uppercase mb-2">Protocol</p>
              <div className="flex flex-wrap gap-1.5">
                {AGENT_LIST.filter((a) => a.category === "protocol").map((a) => (
                  <span key={a.id} className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-default transition-colors ${activeAgent === a.id ? "border-sky-300 bg-sky-50 text-sky-600" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
                    {a.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Decision Support */}
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-widest text-amber-600 uppercase mb-2">Decision Support</p>
              <div className="flex flex-wrap gap-1.5">
                {AGENT_LIST.filter((a) => a.category === "decision").map((a) => (
                  <span key={a.id} className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-default transition-colors ${activeAgent === a.id ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
                    {a.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual Intelligence */}
            <div className="mb-6">
              <p className="text-[10px] font-bold tracking-widest text-violet-600 uppercase mb-2">Visual Intelligence</p>
              <div className="flex flex-wrap gap-1.5">
                {AGENT_LIST.filter((a) => a.category === "visual").map((a) => (
                  <span key={a.id} className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-default transition-colors ${activeAgent === a.id ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
                    {a.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="mb-6">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Tools</p>
              {Object.entries(TOOL_CATEGORIES).map(([category, tools]) => (
                <div key={category} className="mb-3">
                  <p className="text-[10px] font-bold tracking-widest text-sky-600 uppercase mb-1.5">{category}</p>
                  <div className="space-y-0.5">
                    {tools.map((tool) => (
                      <button key={tool} onClick={() => handleToolClick(tool)} className="block w-full text-left px-2.5 py-1.5 text-xs text-slate-500 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors font-mono font-medium">
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Screen Share Section */}
            <div className="mb-6">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Screen Share</p>
              <button onClick={toggleScreenShare} className={`block w-full text-left px-2.5 py-1.5 text-xs font-mono rounded-lg transition-colors font-medium ${isScreenSharing ? "text-red-500 hover:bg-red-50" : "text-sky-600 hover:bg-sky-50"}`}>
                {isScreenSharing ? "stop_screen_share" : "start_screen_share"}
              </button>
            </div>
          </div>

          {/* Agent Activity */}
          <div className="mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
              Agent Activity
            </h3>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs text-slate-600 leading-relaxed">{agentActivity}</p>
            </div>
          </div>

          {/* Conversation */}
          <div>
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
              Conversation
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto sidebar-scrollbar">
              {conversation.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No messages yet</p>
              ) : (
                conversation.map((msg, i) => (
                  <div key={i} className={`p-2.5 border rounded-xl text-xs ${msg.role === "user" ? "bg-sky-50/70 border-sky-100 text-sky-700" : "bg-slate-50 border-slate-100 text-slate-600"}`}>
                    <span className={`font-bold text-[10px] uppercase tracking-wider block mb-0.5 ${msg.role === "user" ? "text-sky-600" : "text-slate-400"}`}>
                      {msg.role === "user" ? "You" : msg.agent || "LUMEN"}
                    </span>
                    <p className="leading-relaxed">{msg.content.slice(0, 300)}{msg.content.length > 300 ? "..." : ""}</p>
                  </div>
                ))
              )}
              <div ref={conversationEndRef} />
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-3 right-3 z-50 w-8 h-8 bg-white/95 border border-slate-200/80 hover:bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors shadow-sm active:scale-95">
        <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
