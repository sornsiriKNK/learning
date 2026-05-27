"use client";

import Box from "@mui/material/Box";
import Sidebar from "@/app/layouts/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          p: 2,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
