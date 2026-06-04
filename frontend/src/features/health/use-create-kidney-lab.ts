"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createKidneyLab } from "@/lib/api/kidney-lab";
import type { CreateKidneyLabRequest } from "@/types/kidney-lab";
import { kidneyLabKeys } from "./query-keys";

export function useCreateKidneyLab() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (body: CreateKidneyLabRequest) => {
      const token = session?.accessToken;
      if (!token) {
        throw new Error("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล");
      }
      return createKidneyLab(token, body);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: kidneyLabKeys.all });
      router.push("/health");
    },
  });
}
