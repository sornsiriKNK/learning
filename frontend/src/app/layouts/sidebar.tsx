"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import DraftsIcon from "@mui/icons-material/Drafts";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSession } from "next-auth/react";

const DRAWER_WIDTH = 250;
const COLLAPSED_WIDTH = 48;

type MenuItemType = {
  label: string;
  href: string;
  icon: React.ReactElement;
};

const MenuItem: MenuItemType[] = [
  { label: "Blog", href: "/blog", icon: <ArticleIcon /> },
  { label: "Health", href: "/health", icon: <FavoriteIcon /> },
  { label: "Money", href: "/money", icon: <SendIcon /> },
  { label: "Drafts", href: "/drafts", icon: <DraftsIcon /> },
];

function isMenuItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const [open, setOpen] = React.useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();
  const displayName =
    session?.user?.name ?? session?.user?.email ?? "ยังไม่ได้เข้าสู่ระบบ";

  return (
    <Box
      component="nav"
      sx={{
        width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Box
        sx={{
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {open ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1,
                py: 0.5,
              }}
            >
              <Typography sx={{ px: 1 }} variant="h6">
                Learning
              </Typography>
              <IconButton onClick={() => setOpen(false)} aria-label="close sidebar">
                <MenuIcon />
              </IconButton>
            </Box>
            <Divider />
            <List>
              {MenuItem.map((item) => (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    selected={isMenuItemActive(pathname, item.href)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: "auto" }}>
              <Divider />
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {displayName}
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", width: COLLAPSED_WIDTH, pt: 1 }}>
              <IconButton onClick={() => setOpen(true)} aria-label="open sidebar">
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: "auto" }}>
              <Divider />
              <Box
                sx={{ display: "flex", justifyContent: "center", py: 1 }}
                title={displayName}
              >
                <AccountCircleIcon />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
