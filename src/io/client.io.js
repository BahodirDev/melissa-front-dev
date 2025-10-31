import { io } from "socket.io-client";

export default class SocketHandle {
  _server;
  _socket;
  _alive;

  constructor(server) {
    this._server = server;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this._socket = io(this._server, {
        transports: ["websocket"],
        path: "/socket.io",
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this._socket.on("connect", () => {
        console.log("✅ Connected to server:", this._socket.id);
        this._alive = true;
        resolve(); // 🔥 endi socket tayyor
      });

      this._socket.on("disconnect", () => {
        console.log("❌ Disconnected from server");
        this._alive = false;
      });

      this._socket.on("connect_error", (err) => {
        console.error("⚠️ Socket connection error:", err.message);
        reject(err);
      });
    });
  }

  /**
   * event listener
   * @param {string} trigger - event nomi (masalan 'new_report')
   * @param {function} callback - data kelganda bajariladigan funksiya
   */
  consumer(trigger, callback) {
    if (!this._socket) {
      console.error("❌ Socket not initialized before consumer()");
      return;
    }
    console.log(`🔌 Listening to event [${trigger}]`);
    this._socket.on(trigger, callback);
  }
}
