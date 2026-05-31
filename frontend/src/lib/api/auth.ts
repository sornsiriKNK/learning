import type { LoginFormValues } from "@/schemas/login";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type LoginSuccessResponse = {
  success: true;
  token: string;
  user: {
    email: string;
  };
};

export type LoginErrorResponse = {
  success: false;
  message: string;
};

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export async function loginRequest(
  payload: LoginFormValues,
): Promise<LoginSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as LoginResponse;

  if (!response.ok || !data.success) {
    const message =
      data.success === false ? data.message : "เข้าสู่ระบบไม่สำเร็จ";
    throw new Error(message);
  }

  return data;
}

export async function getMeRequest(token: string): Promise<{ email: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await response.json()) as
    | { success: true; user: { email: string } }
    | { success: false; message: string };

  if (!response.ok || !data.success) {
    throw new Error(data.success === false ? data.message : "Unauthorized");
  }

  return data.user;
}
