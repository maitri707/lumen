/* Screen share utilities for LUMEN */
"use client";

export class ScreenShareManager {
  private stream: MediaStream | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private video: HTMLVideoElement;
  private captureInterval: ReturnType<typeof setInterval> | null = null;
  private onFrame: ((base64: string) => void) | null = null;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.video = document.createElement("video");
    this.video.autoplay = true;
    this.video.playsInline = true;
  }

  async start(onFrame: (base64: string) => void, fps: number = 1): Promise<MediaStream> {
    this.onFrame = onFrame;

    this.stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: 5 } },
      audio: false,
    });

    this.video.srcObject = this.stream;
    await this.video.play();

    this.canvas.width = 1280;
    this.canvas.height = 720;

    // Capture frames at specified FPS
    this.captureInterval = setInterval(() => {
      this.captureFrame();
    }, 1000 / fps);

    // Handle user stopping share via browser UI
    this.stream.getVideoTracks()[0].onended = () => {
      this.stop();
    };

    return this.stream;
  }

  private captureFrame(): void {
    if (!this.video.videoWidth) return;

    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const base64 = this.canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
    this.onFrame?.(base64);
  }

  stop(): void {
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.video.srcObject = null;
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  isActive(): boolean {
    return this.stream !== null && this.stream.active;
  }
}
