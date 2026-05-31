import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { config } from "../config";

type JwtPayload = {
  sub: string;
  email: string;
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
      const isValidEmail = body.email === config.adminEmail;
      const isValidPassword = body.password === config.adminPassword;

      if (!isValidEmail || !isValidPassword) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const payload: JwtPayload = {
        sub: config.adminEmail,
        email: config.adminEmail,
      };

      const token = await jwtPlugin.sign(payload);

      return {
        success: true,
        token,
        user: {
          email: config.adminEmail,
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

    return {
      success: true,
      user: {
        email: (profile as JwtPayload).email,
      },
    };
  });
