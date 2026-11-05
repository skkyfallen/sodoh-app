import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "@/components/mui/NextLink";
import {
  getAdminFAQs,
  getAdminPillars,
  getAdminProducts,
  getAdminStats,
  getAdminTestimonials,
  getContactSubmissionCounts,
} from "@/lib/data-admin";
import { MdShoppingBag, MdBarChart, MdViewColumn, MdQuestionAnswer, MdStar } from "react-icons/md";

export default async function OverviewPage() {
  const [counts, products, stats, pillars, faqs, testimonials] = await Promise.all([
    getContactSubmissionCounts(), getAdminProducts(), getAdminStats(), getAdminPillars(), getAdminFAQs(), getAdminTestimonials(),
  ]);

  const sections = [
    { label: "Products", value: products.length, Icon: MdShoppingBag, href: "/admin/dashboard/products" },
    { label: "Statistics", value: stats.length, Icon: MdBarChart, href: "/admin/dashboard/stats" },
    { label: "Quality pillars", value: pillars.length, Icon: MdViewColumn, href: "/admin/dashboard/pillars" },
    { label: "FAQs", value: faqs.length, Icon: MdQuestionAnswer, href: "/admin/dashboard/faqs" },
    { label: "Testimonials", value: testimonials.length, Icon: MdStar, href: "/admin/dashboard/testimonials" },
  ];

  return (
    <Box>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, mb: 1 }}
        >
          Your workspace at a glance
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "64ch" }}>
          Review new messages and keep the public site content current.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        component="section"
        aria-labelledby="inbox-heading"
        sx={{
          overflow: "hidden",
          borderRadius: 3,
          bgcolor: "#102b20",
          color: "#fff",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", gap: 3.5, p: { xs: 3, sm: 4, md: 5 }, flex: { md: "0 0 42%" } }}>
            <Box>
              <Typography component="h2" id="inbox-heading" variant="h5" sx={{ fontWeight: 600, letterSpacing: "-0.03em", color: "#fff" }}>
                Messages to review
              </Typography>
              <Typography variant="h1" sx={{ mt: 2, fontSize: "3.75rem", fontWeight: 600, letterSpacing: "-0.05em", color: "#fff" }}>
                {counts.new}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: "rgba(255,255,255,0.85)" }}>
                new message{counts.new === 1 ? "" : "s"}
              </Typography>
            </Box>
            <Button
              component={NextLink}
              href="/admin/dashboard/messages"
              variant="contained"
              sx={{
                minHeight: 44,
                borderRadius: 999,
                bgcolor: "#d7f6e7",
                color: "#064e3b",
                fontWeight: 600,
                "&:hover": { bgcolor: "#fff" },
                "&:focus-visible": { outline: "2px solid #fff", outlineOffset: 2 },
              }}
            >
              Open messages
            </Button>
          </Box>
          <Box
            component="dl"
            sx={{
              m: 0,
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderTop: { xs: "1px solid rgba(255,255,255,0.2)", md: "none" },
              borderLeft: { md: "1px solid rgba(255,255,255,0.2)" },
            }}
          >
            {[
              { label: "Read", value: counts.read },
              { label: "Archived", value: counts.archived },
              { label: "Content items", value: sections.reduce((sum, item) => sum + item.value, 0) },
            ].map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  p: { xs: 2, sm: 3.5 },
                  borderRight: index < 2 ? "1px solid rgba(255,255,255,0.2)" : "none",
                }}
              >
                <Typography component="dt" variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,0.8)" }}>
                  {item.label}
                </Typography>
                <Typography component="dd" variant="h5" sx={{ m: 0, mt: 0.5, fontWeight: 600, color: "#fff" }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      </Paper>

      <Box component="section" aria-labelledby="content-heading" sx={{ mt: 5 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            borderBottom: "1px solid var(--admin-border)",
            pb: 2,
            mb: 0,
          }}
        >
          <Typography component="h2" id="content-heading" variant="h5" sx={{ fontWeight: 600, letterSpacing: "-0.03em" }}>
            Published content
          </Typography>
          <Button
            component={NextLink}
            href="/admin/dashboard/content"
            variant="text"
            sx={{ minHeight: 44, color: "primary.main", fontWeight: 600, textDecoration: "underline", textDecorationColor: "var(--admin-border)", textUnderlineOffset: 4 }}
          >
            Edit page text
          </Button>
        </Stack>
        <List disablePadding sx={{ borderBottom: "1px solid var(--admin-border)" }}>
          {sections.map(({ label, value, Icon, href }) => (
            <ListItemButton
              key={label}
              component={NextLink}
              href={href}
              divider
              sx={{ minHeight: 56, gap: 1.5, px: { xs: 1, sm: 1.5 } }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: "primary.main" }}>
                <Icon aria-hidden="true" size="1.25rem" />
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{ primary: { variant: "subtitle2", sx: { fontWeight: 600 } } }}
              />
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                {value}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
}
