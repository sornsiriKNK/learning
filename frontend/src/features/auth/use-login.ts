"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/lib/api/auth";
import type { LoginFormValues } from "@/schemas/login";
import { useAuthStore } from "@/stores/auth-store";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginFormValues) => loginRequest(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/blog");
    },
  });
}
