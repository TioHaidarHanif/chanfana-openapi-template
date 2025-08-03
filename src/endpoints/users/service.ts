import { User } from "../../types";

// Assumes D1 binding is available as c.env.DB in Hono context
// You may need to adjust DB binding name as per your Env type

export async function getUserById(c: any, id: string): Promise<User | null> {
  const stmt = c.env.DB.prepare("SELECT id, username, password_hash as passwordHash, role FROM users WHERE id = ?").bind(id);
  const result = await stmt.first();
  return result ? result as User : null;
}

export async function getUserByUsername(c: any, username: string): Promise<User | null> {
  const stmt = c.env.DB.prepare("SELECT id, username, password_hash as passwordHash, role FROM users WHERE username = ?").bind(username);
  const result = await stmt.first();
  return result ? result as User : null;
}

export async function createUser(c: any, user: User): Promise<User> {
  const stmt = c.env.DB.prepare(
    "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)"
  ).bind(user.id, user.username, user.passwordHash, user.role);
  await stmt.run();
  return user;
}
