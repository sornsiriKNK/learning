"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  getLoginFieldErrors,
  loginSchema,
  type LoginFormErrors,
  type LoginFormValues,
} from "@/schemas/login";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof LoginFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
      setErrorMessage(null);
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(getLoginFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    router.push("/blog");
    router.refresh();
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        เข้าสู่ระบบ
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        ใช้ admin@example.com / password123 (จาก database)
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <TextField
          label="อีเมล"
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          fullWidth
          autoComplete="email"
        />
        <TextField
          label="รหัสผ่าน"
          type="password"
          value={values.password}
          onChange={handleChange("password")}
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password}
          fullWidth
          autoComplete="current-password"
        />

        <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
          {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "Login"}
        </Button>
      </Box>
    </Paper>
  );
}
