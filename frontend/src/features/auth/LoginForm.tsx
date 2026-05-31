"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useLogin } from "@/features/auth/use-login";
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
  const { mutate, isPending, error } = useLogin();
  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});

  const handleChange =
    (field: keyof LoginFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(getLoginFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    mutate(parsed.data);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        เข้าสู่ระบบ
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        ใช้ admin@example.com / password123 สำหรับทดสอบ
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        {error ? <Alert severity="error">{error.message}</Alert> : null}

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

        <Button type="submit" variant="contained" disabled={isPending} fullWidth>
          {isPending ? "กำลังเข้าสู่ระบบ..." : "Login"}
        </Button>
      </Box>
    </Paper>
  );
}
