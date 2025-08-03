import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import usersRouter from "../../src/endpoints/users/router";

const app = new Hono();
app.route("/users", usersRouter);

describe("User Management", () => {
  it("registers a new user", async () => {
    const res = await app.request("/users/register", {
      method: "POST",
      body: JSON.stringify({ username: "testuser", password: "testpass", role: "user" }),
      headers: { "Content-Type": "application/json" }
    });
    expect(res.status).toBe(200);
    const data = await res.json() as { username: string; role: string };
    expect(data.username).toBe("testuser");
    expect(data.role).toBe("user");
  });

  it("prevents duplicate registration", async () => {
    await app.request("/users/register", {
      method: "POST",
      body: JSON.stringify({ username: "testuser", password: "testpass", role: "user" }),
      headers: { "Content-Type": "application/json" }
    });
    const res = await app.request("/users/register", {
      method: "POST",
      body: JSON.stringify({ username: "testuser", password: "testpass", role: "user" }),
      headers: { "Content-Type": "application/json" }
    });
    expect(res.status).toBe(409);
    const data = await res.json() as { error: string };
    expect(data.error).toBe("Username already exists");
  });

  it("logs in with correct credentials", async () => {
    await app.request("/users/register", {
      method: "POST",
      body: JSON.stringify({ username: "testuser", password: "testpass", role: "user" }),
      headers: { "Content-Type": "application/json" }
    });
    const res = await app.request("/users/login", {
      method: "POST",
      body: JSON.stringify({ username: "testuser", password: "testpass" }),
      headers: { "Content-Type": "application/json" }
    });
    expect(res.status).toBe(200);
    const data = await res.json() as { username: string; role: string };
    expect(data.username).toBe("testuser");
    expect(data.role).toBe("user");
  });

  it("rejects login with wrong password", async () => {
    await app.request("/users/register", {
      method: "POST",
      body: JSON.stringify({ username: "testuser", password: "testpass", role: "user" }),
      headers: { "Content-Type": "application/json" }
    });
    const res = await app.request("/users/login", {
      method: "POST",
      body: JSON.stringify({ username: "testuser", password: "wrongpass" }),
      headers: { "Content-Type": "application/json" }
    });
    expect(res.status).toBe(401);
    const data = await res.json() as { error: string };
    expect(data.error).toBe("Invalid credentials");
  });
});
