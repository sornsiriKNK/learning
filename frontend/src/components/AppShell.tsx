"use client";

import Box from "@mui/material/Box";
import Sidebar from "@/app/layouts/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, p: 2 }}>
        {children}
      </Box>
    </Box>
  );
}
