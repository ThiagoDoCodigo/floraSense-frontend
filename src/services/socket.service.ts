import { io, Socket } from "socket.io-client";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_URL não definida no .env");
}

const SOCKET_URL = BASE_URL.replace("/api/v1", "");

class SocketService {
  public socket: Socket | null = null;

  public connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
      forceNew: true,
    });

    this.socket.on("connect", () => console.log("[WS] Conectado com sucesso!"));
    this.socket.on("disconnect", () => console.log("[WS] Desconectado."));
    this.socket.on("connect_error", (err) =>
      console.log("[WS] Erro de conexão:", err.message),
    );
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public joinPlant(plantId: string) {
    if (this.socket?.connected) {
      this.socket.emit("join_plant", { plantId });
    }
  }

  public leavePlant(plantId: string) {
    if (this.socket?.connected) {
      this.socket.emit("leave_plant", { plantId });
    }
  }
}

export default new SocketService();
