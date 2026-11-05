"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { createClient } from "@/lib/supabase/client";
import NextLink from "@/components/mui/NextLink";
import {
  MdDashboard, MdArticle, MdShoppingBag, MdMail, MdAssignment, MdBarChart,
  MdQuestionAnswer, MdStar, MdViewColumn, MdLogout, MdExpandMore,
  MdMenu, MdClose, MdOpenInNew,
} from "react-icons/md";

const DRAWER_WIDTH = 250;

const CONTENT_CHILDREN = [
  { href: "/admin/dashboard/content", label: "Page text", Icon: MdArticle },
  { href: "/admin/dashboard/products", label: "Products", Icon: MdShoppingBag },
  { href: "/admin/dashboard/stats", label: "Statistics", Icon: MdBarChart },
  { href: "/admin/dashboard/pillars", label: "Quality pillars", Icon: MdViewColumn },
  { href: "/admin/dashboard/faqs", label: "FAQs", Icon: MdQuestionAnswer },
  { href: "/admin/dashboard/testimonials", label: "Testimonials", Icon: MdStar },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isContentActive = CONTENT_CHILDREN.some((item) => isActivePath(pathname, item.href));
  const [contentOpen, setContentOpen] = useState(isContentActive);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    setLogoutError(false);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/admin/login");
      router.refresh();
    } catch {
      setSigningOut(false);
      setLogoutError(true);
      return;
    }
  };

  const closeMobile = () => setMobileOpen(false);

  const navList = (
    <>
      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <ListItemButton
          component={NextLink}
          href="/admin/dashboard/overview"
          onClick={closeMobile}
          selected={pathname === "/admin/dashboard/overview"}
          aria-current={pathname === "/admin/dashboard/overview" ? "page" : undefined}
          sx={navItemSx}
        >
          <ListItemIcon sx={navIconSx}>
            <MdDashboard aria-hidden="true" size="1.25rem" />
          </ListItemIcon>
          <ListItemText primary="Overview" slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }} />
        </ListItemButton>

        <ListItemButton
          onClick={() => setContentOpen((open) => !open)}
          aria-expanded={contentOpen}
          selected={isContentActive && !contentOpen}
          sx={navItemSx}
        >
          <ListItemIcon sx={navIconSx}>
            <MdArticle aria-hidden="true" size="1.25rem" />
          </ListItemIcon>
          <ListItemText primary="Site content" slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }} />
          <MdExpandMore
            aria-hidden="true"
            size="1.25rem"
            style={{
              transition: "transform 200ms",
              transform: contentOpen ? "rotate(180deg)" : "none",
            }}
          />
        </ListItemButton>
        <Collapse in={contentOpen} timeout="auto" unmountOnExit>
          <List
            disablePadding
            sx={{
              ml: 2,
              mt: 0.5,
              pl: 1.5,
              borderLeft: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: 0.25,
            }}
          >
            {CONTENT_CHILDREN.map(({ href, label, Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <ListItemButton
                  key={href}
                  component={NextLink}
                  href={href}
                  onClick={closeMobile}
                  selected={active}
                  aria-current={active ? "page" : undefined}
                  sx={navChildSx}
                >
                  <ListItemIcon sx={navIconSx}>
                    <Icon aria-hidden="true" size="1rem" />
                  </ListItemIcon>
                  <ListItemText primary={label} slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 500 } } }} />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>

        <ListItemButton
          component={NextLink}
          href="/admin/dashboard/messages"
          onClick={closeMobile}
          selected={isActivePath(pathname, "/admin/dashboard/messages")}
          aria-current={isActivePath(pathname, "/admin/dashboard/messages") ? "page" : undefined}
          sx={navItemSx}
        >
          <ListItemIcon sx={navIconSx}>
            <MdMail aria-hidden="true" size="1.25rem" />
          </ListItemIcon>
          <ListItemText primary="Messages" slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }} />
        </ListItemButton>

        <ListItemButton
          component={NextLink}
          href="/admin/dashboard/requests"
          onClick={closeMobile}
          selected={isActivePath(pathname, "/admin/dashboard/requests")}
          aria-current={isActivePath(pathname, "/admin/dashboard/requests") ? "page" : undefined}
          sx={navItemSx}
        >
          <ListItemIcon sx={navIconSx}>
            <MdAssignment aria-hidden="true" size="1.25rem" />
          </ListItemIcon>
          <ListItemText primary="Product requests" slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }} />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.15)" }} />

      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <ListItemButton onClick={handleLogout} disabled={signingOut} sx={navItemSx}>
          <ListItemIcon sx={navIconSx}>
            <MdLogout aria-hidden="true" size="1.25rem" />
          </ListItemIcon>
          <ListItemText
            primary={signingOut ? "Signing out…" : "Sign out"}
            slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }}
          />
        </ListItemButton>
        <ListItemButton component={NextLink} href="/" onClick={closeMobile} sx={navItemSx}>
          <ListItemIcon sx={navIconSx}>
            <MdOpenInNew aria-hidden="true" size="1.25rem" />
          </ListItemIcon>
          <ListItemText primary="View public site" slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }} />
        </ListItemButton>
      </List>
      {logoutError && (
        <Alert severity="error" sx={{ mt: 1.5, bgcolor: "rgba(255,255,255,0.08)", color: "#ffd0ca", "& .MuiAlert-icon": { color: "#ffd0ca" } }}>
          Could not sign out. Check your connection and try again.
        </Alert>
      )}
    </>
  );

  const brandBlock = (onNavigate: () => void, compact: boolean) => (
    <Box
      component={NextLink}
      href="/admin/dashboard/overview"
      onClick={onNavigate}
      sx={{
        display: "block",
        borderRadius: 1,
        py: compact ? 0 : 2,
        px: 1,
        color: "inherit",
        textDecoration: "none",
        borderBottom: compact ? "none" : "1px solid rgba(255,255,255,0.15)",
        mb: compact ? 0 : 2,
        "&:focus-visible": { outline: "2px solid #d7f6e7", outlineOffset: 2 },
      }}
    >
      <Typography
        component="span"
        sx={{ display: "block", fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 600, fontSize: compact ? 18 : 20, letterSpacing: "-0.035em", lineHeight: 1.2 }}
      >
        Sodoh
      </Typography>
      <Typography
        component="span"
        sx={{ display: "block", mt: 0.5, fontSize: compact ? 12 : 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}
      >
        Admin workspace
      </Typography>
    </Box>
  );

  return (
    <>
      {/* Mobile top bar */}
      <AppBar
        position="sticky"
        elevation={0}
        className="admin-sidebar"
        sx={{
          display: { xs: "block", md: "none" },
          bgcolor: (theme) => theme.palette.admin.sidebar,
          color: "#fff",
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 2.5, justifyContent: "space-between" }}>
          {brandBlock(closeMobile, true)}
          <IconButton
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-navigation"
            aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
            sx={{
              width: 44,
              height: 44,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              "&:focus-visible": { outline: "2px solid #d7f6e7", outlineOffset: 2 },
            }}
          >
            {mobileOpen ? <MdClose aria-hidden="true" size="1.35rem" /> : <MdMenu aria-hidden="true" size="1.35rem" />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        aria-label="Admin navigation"
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: (theme) => theme.palette.admin.sidebar,
            color: "#fff",
            px: 2,
            py: 2.5,
          },
        }}
      >
        <Box id="admin-mobile-navigation" role="navigation" aria-label="Admin navigation" sx={{ mt: 1 }}>
          {navList}
        </Box>
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        className="admin-sidebar"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            position: "sticky",
            height: "100dvh",
            top: 0,
            bgcolor: (theme) => theme.palette.admin.sidebar,
            color: "#fff",
            px: 2,
            py: 2.5,
            border: "none",
            overflowY: "auto",
          },
        }}
      >
        {brandBlock(() => {}, false)}
        <Box component="nav" aria-label="Admin navigation" sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
          {navList}
        </Box>
        <Typography variant="caption" sx={{ px: 1.5, pt: 1.5, color: "rgba(255,255,255,0.55)" }}>
          Sodoh Nigeria Limited
        </Typography>
      </Drawer>
    </>
  );
}

const navItemSx = {
  minHeight: 44,
  borderRadius: "10px",
  px: 1.5,
  py: 1.25,
  color: "rgba(255,255,255,0.8)",
  "&:hover": { bgcolor: "rgba(255,255,255,0.1)", color: "#fff" },
  "&.Mui-disabled": { opacity: 0.6, color: "rgba(255,255,255,0.75)" },
  "&.Mui-selected": {
    bgcolor: (theme: { palette: { admin: { active: string } } }) => theme.palette.admin.active,
    color: "#0b3b22",
    "&:hover": { bgcolor: (theme: { palette: { admin: { active: string } } }) => theme.palette.admin.active },
    "& .MuiListItemIcon-root": { color: "#0b3b22" },
  },
  "&:focus-visible": { outline: "2px solid #d7f6e7", outlineOffset: 2 },
} as const;

const navChildSx = {
  minHeight: 44,
  borderRadius: "8px",
  px: 1.5,
  py: 1,
  color: "rgba(255,255,255,0.7)",
  "&:hover": { bgcolor: "rgba(255,255,255,0.1)", color: "#fff" },
  "&.Mui-selected": {
    bgcolor: "rgba(255,255,255,0.1)",
    color: "#d7f6e7",
    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
    "& .MuiListItemIcon-root": { color: "#d7f6e7" },
  },
  "&:focus-visible": { outline: "2px solid #d7f6e7", outlineOffset: 2 },
} as const;

const navIconSx = {
  minWidth: 0,
  mr: 1.5,
  color: "inherit",
} as const;
