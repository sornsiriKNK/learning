import type {
  ApiErrorResponse,
  CreateKidneyLabRequest,
  KidneyLabRecord,
} from "@/types/kidney-lab";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

async function handleApiError(
  response: Response,
  data: ApiErrorResponse | { success?: boolean; message?: string },
): Promise<never> {
  const message =
    "message" in data && typeof data.message === "string"
      ? data.message
      : `Request failed (${response.status})`;
  throw new Error(message);
}

/**
 * POST /health/kidney-labs
 * บันทึกผลตรวจ (เลือดอย่างเดียว / ปัสสาวะอย่างเดียว / ครบ)
 */
export async function createKidneyLab(
  token: string,
  body: CreateKidneyLabRequest,
): Promise<KidneyLabRecord> {
  const response = await fetch(`${API_BASE_URL}/health/kidney-labs`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });

  const data = await parseJson<
    { success: true; data: KidneyLabRecord } | ApiErrorResponse
  >(response);

  if (!response.ok || !data.success) {
    return handleApiError(response, data);
  }

  return data.data;
}

/**
 * GET /health/kidney-labs
 * ดึงรายการทั้งหมดของ user
 */
export async function listKidneyLabs(token: string): Promise<KidneyLabRecord[]> {
  const response = await fetch(`${API_BASE_URL}/health/kidney-labs`, {
    headers: authHeaders(token),
    cache: "no-store",
  });

  const data = await parseJson<
    { success: true; data: KidneyLabRecord[] } | ApiErrorResponse
  >(response);

  if (!response.ok || !data.success) {
    return handleApiError(response, data);
  }

  return data.data;
}

/**
 * GET /health/kidney-labs/:id
 * ดึง 1 รายการ
 */
export async function getKidneyLab(
  token: string,
  id: number,
): Promise<KidneyLabRecord> {
  const response = await fetch(`${API_BASE_URL}/health/kidney-labs/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });

  const data = await parseJson<
    { success: true; data: KidneyLabRecord } | ApiErrorResponse
  >(response);

  if (!response.ok || !data.success) {
    return handleApiError(response, data);
  }

  return data.data;
}

/**
 * DELETE /health/kidney-labs/:id
 * ลบรายการ
 */
export async function deleteKidneyLab(
  token: string,
  id: number,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/health/kidney-labs/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  const data = await parseJson<
    { success: true; message: string } | ApiErrorResponse
  >(response);

  if (!response.ok || !data.success) {
    return handleApiError(response, data);
  }
}
