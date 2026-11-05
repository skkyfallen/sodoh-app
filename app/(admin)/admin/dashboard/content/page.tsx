import { getAdminPageContent } from "@/lib/data-admin";
import CMSEditor from "@/components/admin/CMSEditor";
import PageHeader from "@/components/admin/PageHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default async function ContentPage() {
  const [homeContent, aboutContent, productsContent, contactContent] =
    await Promise.all([
      getAdminPageContent("home"),
      getAdminPageContent("about"),
      getAdminPageContent("products"),
      getAdminPageContent("contact"),
    ]);

  return (
    <>
      <PageHeader
        title="Site Content"
        description="Edit copy, links, and structured content across the public site. Mark a section reviewed only after its claims are checked."
      />

      <Paper
        elevation={0}
        component="section"
        aria-labelledby="managed-in-code-heading"
        sx={{ mb: 4, px: { xs: 2.5, sm: 3 }, py: 2, border: "1px solid var(--admin-border)" }}
      >
        <Typography component="h2" id="managed-in-code-heading" variant="subtitle2" sx={{ fontWeight: 700 }}>
          Managed in code
        </Typography>
        <List dense disablePadding sx={{ mt: 1 }}>
          {[
            "Home intro — HomeIntro",
            "Enquiry routes — EnquiryRoutes",
            "Home call to action — SiteCta",
            "Products grid explanatory copy",
            "Contact form",
            "Header and footer",
            "Product request dialog",
          ].map((item) => (
            <ListItem key={item} disableGutters disablePadding sx={{ py: 0.25 }}>
              <ListItemText primary={item} slotProps={{ primary: { variant: "body2", sx: { color: "text.secondary" } } }} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <CMSEditor
        pages={{
          home: homeContent,
          about: aboutContent,
          products: productsContent,
          contact: contactContent,
        }}
      />
    </>
  );
}
