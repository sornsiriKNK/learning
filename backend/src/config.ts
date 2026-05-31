const DEFAULT_ADMIN_EMAIL = "admin@example.com";
const DEFAULT_ADMIN_PASSWORD = "password123";

export const config = {
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: process.env.JWT_SECRET ?? "dev-jwt-secret-change-me",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  adminEmail: process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD,
} as const;
