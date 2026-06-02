const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type ApiUser = {
  id: number;
  email: string;
  name: string;
};

export async function getMeRequest(token: string): Promise<ApiUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = (await response.json()) as
    | { success: true; user: ApiUser }
    | { success: false; message: string };

  if (!response.ok || !data.success) {
    throw new Error(data.success === false ? data.message : "Unauthorized");
  }

  return data.user;
}
