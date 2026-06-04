import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { config } from "../config";

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export const jwtAuthPlugin = new Elysia({ name: "jwt-auth-plugin" })
  .use(
    jwt({
      name: "jwt",
      secret: config.jwtSecret,
    }),
  )
  .derive({ as: "scoped" }, async ({ jwt: jwtPlugin, request }) => {
    const authorization = request.headers.get("authorization");
    const token = authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return { userId: null as number | null };
    }

    const profile = await jwtPlugin.verify(token);

    if (!profile) {
      return { userId: null as number | null };
    }

    const payload = profile as JwtPayload;
    const userId = Number(payload.sub);

    if (!Number.isFinite(userId)) {
      return { userId: null as number | null };
    }

    return { userId };
  })
  .onBeforeHandle(({ userId, set }) => {
    if (userId === null) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
      };
    }
  });
