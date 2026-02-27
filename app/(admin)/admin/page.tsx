import { redirect } from "next/navigation";

// /admin itself has no UI — send straight to the dashboard.
// Middleware handles the unauthenticated case first, so by the
// time this runs the user is guaranteed to be logged in.
export default function AdminRootPage() {
  redirect("/admin/dashboard/overview");
}
