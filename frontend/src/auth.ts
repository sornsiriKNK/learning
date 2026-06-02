import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/schemas/login";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

type BackendLoginResponse =
  | {
      success: true;
      token: string;
      user: {
        id: number;
        email: string;
        name: string;
      };
    }
  | {
      success: false;
      message: string;
    };

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        });

        const data = (await response.json()) as BackendLoginResponse;

        if (!response.ok || !data.success) {
          return null;
        }

        return {
          id: String(data.user.id),
          email: data.user.email,
          name: data.user.name,
          accessToken: data.token,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? session.user.id;
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
});
