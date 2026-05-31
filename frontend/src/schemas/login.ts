import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน")
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type LoginFormField = keyof LoginFormValues;

export type LoginFormErrors = Partial<Record<LoginFormField, string>>;

export function getLoginFieldErrors(
  error: z.ZodError<LoginFormValues>,
): LoginFormErrors {
  const fieldErrors: LoginFormErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !fieldErrors[field as LoginFormField]) {
      fieldErrors[field as LoginFormField] = issue.message;
    }
  }

  return fieldErrors;
}
