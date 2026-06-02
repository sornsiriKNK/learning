import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { config } from "../config";
import { verifyUserPassword } from "../services/auth";

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: config.jwtSecret,
    }),
  )
  .post(
    "/login",
    async ({ body, jwt: jwtPlugin, set }) => {
      const user = await verifyUserPassword(body.email, body.password);

      if (!user) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        email: user.email,
        name: user.name,
      };

      const token = await jwtPlugin.sign(payload);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
      }),
    },
  )
  .get("/me", async ({ jwt: jwtPlugin, request, set }) => {
    const authorization = request.headers.get("authorization");
    const token = authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      set.status = 401;
      return { success: false, message: "Unauthorized" };
    }

    const profile = await jwtPlugin.verify(token);

    if (!profile) {
      set.status = 401;
      return { success: false, message: "Invalid token" };
    }

    const jwtPayload = profile as JwtPayload;

    return {
      success: true,
      user: {
        id: Number(jwtPayload.sub),
        email: jwtPayload.email,
        name: jwtPayload.name,
      },
    };
  });
