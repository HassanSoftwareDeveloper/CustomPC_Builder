import { request } from "./api";
import { STORAGE_KEYS } from "../constants/storageKeys";

const SESSION_KEY = STORAGE_KEYS.SESSION;
const TOKEN_KEY = STORAGE_KEYS.TOKEN;

function startSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function getStoredSession() {
  const saved = localStorage.getItem(SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export async function login({ email, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });
  return startSession(data);
}

export async function signup({ name, email, password }) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
  });
  return startSession(data);
}


export function getCustomers() {
  return [];
}