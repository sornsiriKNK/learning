"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { listKidneyLabs } from "@/lib/api/kidney-lab";
import { kidneyLabKeys } from "./query-keys";

export function useListKidneyLabs() {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: kidneyLabKeys.all,
    queryFn: async () => {
      const token = session?.accessToken;
      if (!token) {
        throw new Error("กรุณาเข้าสู่ระบบ");
      }
      return listKidneyLabs(token);
    },
    enabled: status === "authenticated" && Boolean(session?.accessToken),
  });
}
