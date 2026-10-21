import { MOCK_USERS } from "../data/mockUsers";
import { ROLES } from "../constants/roles";
import { STORAGE_KEYS } from "../constants/storageKeys";


const USERS_KEY = STORAGE_KEYS.USERS;
const SESSION_KEY = STORAGE_KEYS.SESSION;
const FAKE_DELAY_MS = 500;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readUsers() {
  const saved = localStorage.getItem(USERS_KEY);
  return saved ? JSON.parse(saved) : MOCK_USERS;
}

function startSession(user) {
  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export function getStoredSession() {
  const saved = localStorage.getItem(SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export async function login({ email, password }) {
  await wait(FAKE_DELAY_MS);

  const normalizedEmail = email.trim().toLowerCase();
  const user = readUsers().find(
    (u) => u.email === normalizedEmail && u.password === password
  );

  if (!user) {
    throw new Error("Incorrect email or password.");
  }

  return startSession(user);
}

export async function signup({ name, email, password }) {
  await wait(FAKE_DELAY_MS);

  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    id: `u-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "customer",
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  return startSession(newUser);
}


export function getCustomers() {
  return readUsers()
    .filter((user) => user.role === ROLES.CUSTOMER)
    .map((user) => ({ id: user.id, name: user.name, email: user.email }));
}