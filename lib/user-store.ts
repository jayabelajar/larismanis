import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const userFilePath = path.join(dataDirectory, "users.json");

async function ensureUserFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(userFilePath, "utf8");
  } catch {
    await writeFile(userFilePath, "[]", "utf8");
  }
}

export async function getAllUsers() {
  await ensureUserFile();
  const raw = await readFile(userFilePath, "utf8");
  return JSON.parse(raw) as StoredUser[];
}

export async function getUserByEmail(email: string) {
  const users = await getAllUsers();
  return users.find((user) => user.email === email.toLowerCase()) ?? null;
}

export async function createUser(user: Omit<StoredUser, "id" | "createdAt">) {
  const users = await getAllUsers();
  const existingUser = users.find((item) => item.email === user.email.toLowerCase());

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const nextUser: StoredUser = {
    id: crypto.randomUUID(),
    name: user.name,
    email: user.email.toLowerCase(),
    passwordHash: user.passwordHash,
    createdAt: new Date().toISOString(),
  };

  await writeFile(userFilePath, JSON.stringify([...users, nextUser], null, 2), "utf8");

  return nextUser;
}
