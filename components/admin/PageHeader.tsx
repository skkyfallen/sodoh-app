import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

/**
 * Compact page furniture shared by the admin section pages:
 * a page title, a short description, and an optional primary action.
 * Server-safe (no handlers of its own).
 */
export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        mb: 4,
        pb: 2,
        borderBottom: "1px solid var(--admin-border)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "flex-end" }, justifyContent: "space-between" }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              color: "var(--admin-ink)",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 0.5, maxWidth: "64ch", color: "var(--admin-muted)" }}
          >
            {description}
          </Typography>
        </Box>
        {action ? (
          <Box sx={{ flexShrink: 0 }}>{action}</Box>
        ) : null}
      </Stack>
    </Box>
  );
}
