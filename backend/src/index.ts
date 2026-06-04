import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { config } from "./config";
import { authRoutes } from "./routes/auth";
import { healthRoutes } from "./routes/health";

const app = new Elysia()
  .use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "DELETE", "OPTIONS"],
    }),
  )
  .get("/", () => ({ status: "ok" }))
  .use(authRoutes)
  .use(healthRoutes)
  .listen(config.port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
