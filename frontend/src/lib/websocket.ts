/* WebSocket client for LUMEN */
"use client";

import { WSMessage, AgentResponse, ConnectionStatus } from "@/types";

type MessageHandler = (msg: WSMessage) => void;

class LumenWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  public status: ConnectionStatus = "disconnected";

  constructor(url?: string) {
    this.url = url || process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.status = "connecting";
    this.emit("status", { type: "status", data: { status: "connecting" }, timestamp: new Date().toISOString() });

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.status = "connected";
        this.reconnectAttempts = 0;
        this.emit("status", { type: "status", data: { status: "connected" }, timestamp: new Date().toISOString() });
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);
          this.emit(msg.type, msg);
          this.emit("*", msg);
        } catch (e) {
          console.error("Failed to parse WS message:", e);
        }
      };

      this.ws.onclose = () => {
        this.status = "disconnected";
        this.emit("status", { type: "status", data: { status: "disconnected" }, timestamp: new Date().toISOString() });
        this.tryReconnect();
      };

      this.ws.onerror = () => {
        this.status = "error";
        this.emit("status", { type: "status", data: { status: "error" }, timestamp: new Date().toISOString() });
      };
    } catch {
      this.status = "error";
    }
  }

  disconnect(): void {
    this.maxReconnectAttempts = 0;
    this.ws?.close();
    this.ws = null;
    this.status = "disconnected";
  }

  private tryReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    }
  }

  send(type: string, data: Record<string, unknown> = {}): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data, timestamp: new Date().toISOString() }));
    }
  }

  sendVoiceCommand(text: string): void {
    this.send("voice_command", { text });
  }

  sendScreenFrame(imageBase64: string, question?: string): void {
    this.send("screen_frame", { image_base64: imageBase64, question });
  }

  sendToolCall(tool: string, args: Record<string, unknown> = {}): void {
    this.send("tool_call", { tool, args });
  }

  on(type: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type)!.push(handler);
    return () => {
      const h = this.handlers.get(type);
      if (h) this.handlers.set(type, h.filter((fn) => fn !== handler));
    };
  }

  private emit(type: string, msg: WSMessage): void {
    this.handlers.get(type)?.forEach((h) => h(msg));
  }
}

// Singleton
let instance: LumenWebSocket | null = null;

export function getWebSocket(): LumenWebSocket {
  if (!instance) instance = new LumenWebSocket();
  return instance;
}

export { LumenWebSocket };
