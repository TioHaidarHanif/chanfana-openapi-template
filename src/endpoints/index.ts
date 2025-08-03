import { Hono } from "hono";
import usersRouter from "./users/router";
import { tasksRouter } from "./tasks/router";
// ...existing code...

const app = new Hono();

// Mount user endpoints
app.route("/users", usersRouter);

// Mount task endpoints
app.route("/tasks", tasksRouter);

// ...existing code...

export default app;
