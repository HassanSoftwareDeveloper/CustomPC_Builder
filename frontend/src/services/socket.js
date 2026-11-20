import { io } from "socket.io-client";
import { API_URL, refreshAccessToken } from "./api";
import { STORAGE_KEYS } from "../constants/storageKeys";

const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,

  auth: (callback) =>
    callback({ token: localStorage.getItem(STORAGE_KEYS.TOKEN) }),
});

let triedRefresh = false;

socket.on("connect", () => {
  triedRefresh = false;
});

socket.on("connect_error", async (error) => {
  if (!error.message.includes("expired") || triedRefresh) return;
  triedRefresh = true;
  try {
    await refreshAccessToken();
    socket.connect();
  } catch {}
});

export function connectSocket() {
  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}
