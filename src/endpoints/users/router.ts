import { Hono } from "hono";
import { User, UserRole } from "../../types";

// Dummy in-memory user store for demonstration
const users: User[] = [];

const usersRouter = new Hono();

// Register endpoint
usersRouter.post("/register", async (c) => {
  const { username, password, role } = await c.req.json();
  if (!username || !password || !role) {
    return c.json({ error: "Missing fields" }, 400);
  }
  if (role !== "admin" && role !== "user") {
    return c.json({ error: "Invalid role" }, 400);
  }
  if (users.find((u) => u.username === username)) {
    return c.json({ error: "Username already exists" }, 409);
  }
  // Simple hash for demo (replace with bcrypt in production)
  const passwordHash = btoa(password);
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    passwordHash,
    role,
  };
  users.push(newUser);
  return c.json({ id: newUser.id, username: newUser.username, role: newUser.role });
});

// Login endpoint
usersRouter.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  const user = users.find((u) => u.username === username);
  if (!user || user.passwordHash !== btoa(password)) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  // In production, return JWT or session
  return c.json({ id: user.id, username: user.username, role: user.role });
});

export default usersRouter;
