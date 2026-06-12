"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AGENT_LIST, TOOL_CATEGORIES, ConnectionStatus, ConversationMessage, AgentResponse, OverlayData } from "@/types";
import { getWebSocket } from "@/lib/websocket";
import { ScreenShareManager } from "@/lib/screenShare";
import { ClinicalCard } from "@/components/console/ClinicalCards";

export default function ConsolePage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [agentActivity, setAgentActivity] = useState<string>("Waiting for connection...");
  const [activeAgent, setActiveAgent] = useState<string>("orchestrator");
  const activeAgentRef = useRef<string>("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [overlays, setOverlays] = useState<OverlayData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  // Keep ref in sync
  useEffect(() => {
    activeAgentRef.current = activeAgent;
  }, [activeAgent]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const screenShareRef = useRef<ScreenShareManager | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef(getWebSocket());
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

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
        const data = msg.data as unknown as AgentResponse & { audio_base64?: string };
        setAgentActivity(`${data.agent}: Response delivered`);
        setActiveAgent(data.agent);
        setConversation((prev) => [...prev, { role: "agent", content: data.response, agent: data.agent, timestamp: msg.timestamp }]);
        
        if (data.audio_base64) {
          if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
          }
          const audio = new Audio("data:audio/mp3;base64," + data.audio_base64);
          currentAudioRef.current = audio;
          audio.play().catch(e => console.error("Audio playback failed:", e));
        } else if (data.response) {
          // Fallback to browser's built-in Web Speech API if AWS Polly is not configured
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel(); // Interrupt previous speech
            const utterance = new SpeechSynthesisUtterance(data.response);
            window.speechSynthesis.speak(utterance);
          }
        }

        if (data.tool_result?.overlay) {
          const newOverlay = data.tool_result!.overlay as OverlayData;
          setOverlays((prev) => {
            const existing = prev.findIndex((o) => o.type === newOverlay.type);
            if (existing >= 0) { const updated = [...prev]; updated[existing] = newOverlay; return updated; }
            return [...prev, newOverlay];
          });
          setActiveTab(newOverlay.type);
        }
        if (data.tool_result?.action === "hide_overlay") {
          setOverlays((prev) => {
            const updated = prev.filter((o) => o.type !== data.tool_result!.overlay_type);
            if (activeTab === data.tool_result!.overlay_type && updated.length > 0) setActiveTab(updated[updated.length - 1].type);
            return updated;
          });
        }
        if (data.tool_result?.action === "hide_all") {
          setOverlays([]);
          setActiveTab("");
        }
      }),
      ws.on("tool_result", (msg) => {
        const toolName = msg.data.tool;
        if (toolName === "stop_screen_share") {
          setIsScreenSharing(false);
          screenShareRef.current?.stop();
          if (videoRef.current) videoRef.current.srcObject = null;
        }

        const result = msg.data.result as Record<string, unknown>;
        if (result?.overlay) {
          const overlay = result.overlay as OverlayData;
          setOverlays((prev) => {
            const existing = prev.findIndex((o) => o.type === overlay.type);
            if (existing >= 0) { const updated = [...prev]; updated[existing] = overlay; return updated; }
            return [...prev, overlay];
          });
          setActiveTab(overlay.type);
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

  // ─── Custom AudioWorklet VAD ───
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const keepMicActiveRef = useRef(false);

  // WAV Encoding Helper
  const encodeWAV = useCallback((chunks: Float32Array[], sampleRate: number): Blob => {
    let length = 0;
    for (let i = 0; i < chunks.length; i++) length += chunks[i].length;
    
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // 1 channel
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length * 2, true);
    
    let offset = 44;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      for (let j = 0; j < chunk.length; j++) {
        let s = Math.max(-1, Math.min(1, chunk[j]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
      }
    }
    return new Blob([buffer], { type: 'audio/wav' });
  }, []);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      keepMicActiveRef.current = false;
      setIsListening(false);
      if (workletNodeRef.current) {
        workletNodeRef.current.disconnect();
        workletNodeRef.current = null;
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setAgentActivity("LUMEN offline.");
    } else {
      keepMicActiveRef.current = true;
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = audioCtx;
        
        await audioCtx.audioWorklet.addModule('/vad-worklet.js');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioStreamRef.current = stream;
        
        const source = audioCtx.createMediaStreamSource(stream);
        const node = new AudioWorkletNode(audioCtx, 'vad-processor');
        workletNodeRef.current = node;
        
        let audioChunks: Float32Array[] = [];
        
        node.port.onmessage = (e) => {
          if (e.data.type === 'start') {
            audioChunks = [];
            setAgentActivity("Hearing audio...");
          } else if (e.data.type === 'chunk') {
            audioChunks.push(e.data.data);
          } else if (e.data.type === 'stop') {
            if (audioChunks.length > 0) {
              setAgentActivity("Encoding and sending audio snippet...");
              const wavBlob = encodeWAV(audioChunks, 16000);
              wsRef.current.sendAudioBlob(wavBlob);
            }
            audioChunks = [];
          }
        };
        
        source.connect(node);
        setIsListening(true);
        setAgentActivity("VAD active. Listening continuously...");
      } catch (err) {
        console.error("Failed to start VAD:", err);
        setAgentActivity("Microphone access denied or VAD failed.");
      }
    }
  }, [isListening, encodeWAV]);

  // Screen share toggle
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      screenShareRef.current?.stop();
      setIsScreenSharing(false);
      if (videoRef.current) videoRef.current.srcObject = null;
      wsRef.current.sendToolCall("stop_screen_share");
      
      keepMicActiveRef.current = false;
      if (isListening) {
        toggleListening();
      }
      return;
    }
    try {
      if (!screenShareRef.current) screenShareRef.current = new ScreenShareManager();
      const stream = await screenShareRef.current.start((base64) => {
        // Send frames so the backend always has passive visual context
        wsRef.current.sendScreenFrame(base64);
      }, 0.2); // 1 frame every 5 seconds
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsScreenSharing(true);
      wsRef.current.sendToolCall("start_screen_share");
      
      // Auto-start microphone when screen sharing starts
      keepMicActiveRef.current = true;
      if (!isListening) {
        toggleListening();
      }
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  }, [isScreenSharing, isListening, toggleListening]);

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
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
          <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-contain ${isScreenSharing ? "block" : "hidden"}`} />
          
          {!isScreenSharing && (
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800 border border-slate-700 shadow-sm flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm mb-4">No screen shared</p>
              <button onClick={toggleScreenShare} className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98] text-sm">
                Start Screen Share
              </button>
            </div>
          )}

          {/* Bottom toolbar */}
          {isScreenSharing && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 pointer-events-none">
              <div className="flex items-center justify-center gap-4 pointer-events-auto">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 border border-slate-700 shadow-sm rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-medium text-slate-300">Screen sharing active</span>
                </div>
                <button onClick={toggleScreenShare} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-medium transition-all shadow-sm active:scale-95">
                  Stop Sharing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Clinical Displays Column (non-briefing overlays) ──────── */}
      {(() => {
        const briefingOverlays = overlays.filter((o) => o.type === "briefing_patient_data");
        return (
          <>
            {/* ─── Patient Briefing Panel (second right panel) ────────── */}
            <div className={`${briefingOverlays.length > 0 ? "w-[26rem] border-l border-sky-100 opacity-100" : "w-0 border-none opacity-0"} transition-all duration-300 bg-gradient-to-b from-white to-sky-50/30 flex flex-col overflow-y-auto sidebar-scrollbar shadow-inner shrink-0 relative z-10`}>
              <div className="p-4 space-y-4 w-[26rem]">
                {/* Panel header */}
                <div className="flex items-center gap-2 pb-2 border-b border-sky-100">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                  <span className="text-[10px] font-extrabold tracking-widest text-sky-600 uppercase">Patient Data</span>
                </div>
                {briefingOverlays.map((overlay) => (
                  <ClinicalCard
                    key={overlay.type}
                    overlay={overlay}
                    onClose={() => setOverlays((prev) => prev.filter((o) => o.type !== overlay.type))}
                    inline={true}
                  />
                ))}
              </div>
            </div>
          </>
        );
      })()}
      {/* ─── Clinical Displays Column ───────────────────────────────── */}
      {(() => {
        const regularOverlays = overlays.filter((o) => o.type !== "briefing_patient_data");
        return (
          <div className={`${regularOverlays.length > 0 ? "w-[32rem] border-l border-slate-200 opacity-100" : "w-0 border-none opacity-0"} transition-all duration-300 bg-slate-50/80 flex flex-col shadow-inner shrink-0 relative z-10 overflow-hidden`}>
            {regularOverlays.length > 0 && (
              <div className="flex border-b border-slate-200 bg-white overflow-x-auto sidebar-scrollbar shrink-0">
                {regularOverlays.map((o) => (
                  <button 
                    key={o.type} 
                    onClick={() => setActiveTab(o.type)}
                    className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${activeTab === o.type ? 'border-sky-500 text-sky-600 bg-sky-50/30' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    {o.title.split('—')[0].trim()}
                  </button>
                ))}
              </div>
            )}
            <div className="p-4 w-[32rem] flex-1 overflow-y-auto sidebar-scrollbar">
              {regularOverlays.filter(o => o.type === activeTab).map((overlay) => (
                <ClinicalCard 
                  key={overlay.type} 
                  overlay={overlay} 
                  onClose={() => {
                    const newOverlays = overlays.filter((o) => o.type !== overlay.type);
                    setOverlays(newOverlays);
                    if (activeTab === overlay.type && newOverlays.length > 0) setActiveTab(newOverlays[newOverlays.length - 1].type);
                  }} 
                  inline={true}
                />
              ))}
            </div>
          </div>
        );
      })()}

      {/* ─── System Controls Column ─────────────────────────────────── */}
      <div className="w-[20rem] transition-all duration-300 border-l border-slate-200 bg-white flex flex-col overflow-hidden shadow-xl shrink-0 z-20">
        {/* Voice Orb */}
        <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="relative w-20 h-20 mx-auto mb-3">
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
              <svg className={`w-8 h-8 ${isListening ? "text-white" : connectionStatus === "connected" ? "text-sky-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
          <p className={`text-[10px] font-bold tracking-widest ${isListening ? "text-red-500 animate-pulse" : connectionStatus === "connected" ? "text-sky-600" : "text-slate-400"} uppercase mt-2`}>
            {isListening
              ? "LISTENING... TAP TO STOP"
              : connectionStatus === "connected"
              ? "LUMEN ONLINE"
              : connectionStatus === "connecting"
              ? "CONNECTING..."
              : "LUMEN OFFLINE"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto sidebar-scrollbar bg-white p-4">
          
          {/* Collapsible Agents & Tools Section */}
          <details className="group mb-6" open>
            <summary className="flex cursor-pointer list-none items-center justify-between pb-2 border-b border-slate-100 focus:outline-none">
              <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Agents & Tools
              </h3>
              <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            
            <div className="pt-4">
              {/* Agents */}
              <div className="mb-4">
                <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">Agents</p>
                <div className="space-y-1">
                  {AGENT_LIST.filter((a) => a.id === "orchestrator").map((a) => (
                    <div key={a.id} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-default transition-all border ${activeAgent === a.id ? "bg-sky-50 text-sky-600 border-sky-200 shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"}`}>
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol */}
              <div className="mb-4">
                <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">Protocol</p>
                <div className="grid grid-cols-2 gap-2">
                  {AGENT_LIST.filter((a) => a.category === "protocol").map((a) => (
                    <div key={a.id} className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center cursor-default transition-colors ${activeAgent === a.id ? "border-sky-300 bg-sky-50 text-sky-600 shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Support */}
              <div className="mb-4">
                <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">Decision Support</p>
                <div className="grid grid-cols-2 gap-2">
                  {AGENT_LIST.filter((a) => a.category === "decision").map((a) => (
                    <div key={a.id} className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center cursor-default transition-colors ${activeAgent === a.id ? "border-amber-300 bg-amber-50 text-amber-700 shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Intelligence */}
              <div className="mb-6">
                <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">Visual Intelligence</p>
                <div className="space-y-2">
                  {AGENT_LIST.filter((a) => a.category === "visual").map((a) => (
                    <div key={a.id} className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center cursor-default transition-colors ${activeAgent === a.id ? "border-violet-300 bg-violet-50 text-violet-700 shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Screen Share Section */}
              <div className="mb-2">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Screen Share</p>
                <button onClick={toggleScreenShare} className={`block w-full text-center px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors font-medium ${isScreenSharing ? "text-red-500 border-red-200 hover:bg-red-50" : "text-sky-600 border-sky-200 hover:bg-sky-50"}`}>
                  {isScreenSharing ? "stop_screen_share" : "start_screen_share"}
                </button>
              </div>
            </div>
          </details>

          {/* Agent Activity */}
          <div className="mb-6 mt-4">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
              Agent Activity
            </h3>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-[11px] text-slate-600 leading-relaxed break-all font-mono">{agentActivity}</p>
            </div>
          </div>

          {/* Conversation Log */}
          <div>
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
              Conversation Log
            </h3>
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {conversation.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No commands yet</p>
              ) : (
                conversation.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-2.5 border rounded-xl text-xs transition-all ${
                      msg.role === "user" 
                        ? "border-slate-100 bg-slate-50" 
                        : "border-sky-100 bg-sky-50/40 text-slate-800"
                    }`}
                  >
                    <span className={`font-bold text-[9px] uppercase tracking-wider block mb-1 ${
                      msg.role === "user" ? "text-slate-400" : "text-sky-600"
                    }`}>
                      {msg.role === "user" ? "Doctor Command" : `${msg.agent || "Agent"} Response`}
                    </span>
                    <p className={`leading-relaxed font-medium ${
                      msg.role === "user" ? "text-slate-700" : "text-sky-950"
                    }`}>
                      {msg.role === "user" ? `"${msg.content}"` : msg.content}
                    </p>
                  </div>
                ))
              )}
              <div ref={conversationEndRef} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
