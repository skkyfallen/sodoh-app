import type { Metadata } from "next";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AdminSidebar from "@/components/admin/AdminSidebar";
import NextLink from "@/components/mui/NextLink";

export const metadata: Metadata = {
  title: "Admin Dashboard — Sodoh Nigeria",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100dvh",
        bgcolor: "var(--admin-page)",
        color: "var(--admin-ink)",
      }}
    >
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          minWidth: 0,
          flex: 1,
          px: { xs: 2.5, sm: 4, md: 5 },
          pb: { xs: 5, md: 7 },
          pt: { xs: 2.5, md: 3.5 },
        }}
      >
        <Box sx={{ mx: "auto", maxWidth: 1440 }}>
          <AppBar
            position="static"
            elevation={0}
            sx={{
              bgcolor: "transparent",
              color: "var(--admin-ink)",
              borderBottom: "1px solid var(--admin-border)",
              mb: 4,
            }}
          >
            <Toolbar disableGutters sx={{ minHeight: 44, gap: 2, py: 1.5 }}>
              <Box
                aria-hidden="true"
                sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", flexShrink: 0 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500, color: "var(--admin-muted)" }}>
                Content and enquiries
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                component={NextLink}
                href="/"
                variant="text"
                sx={{
                  minHeight: 44,
                  color: "var(--admin-ink)",
                  textDecoration: "underline",
                  textDecorationColor: "var(--admin-border)",
                  textUnderlineOffset: 4,
                  fontWeight: 600,
                  "&:hover": { color: "primary.main", textDecoration: "underline" },
                }}
              >
                View public site&nbsp;&nbsp;→
              </Button>
            </Toolbar>
          </AppBar>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
