import { expect, test } from "@playwright/test";

test("unauthenticated dashboard visits redirect to the admin login page", async ({ page }) => {
  await page.goto("/admin/dashboard/overview");

  await expect(page).toHaveURL(/\/admin\/login(?:\?|$)/);
  await expect(page.getByRole("heading", { name: "Sign in to your workspace" })).toBeVisible();
});

test("admin login page renders the sign-in form", async ({ page }) => {
  await page.goto("/admin/login");

  await expect(page.getByRole("heading", { name: "Sign in to your workspace" })).toBeVisible();
  await expect(page.getByLabel("Email address")).toHaveAttribute("type", "email");
  await expect(page.getByLabel("Password")).toHaveAttribute("type", "password");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test("an authenticated staff member can open the admin overview", async ({ page }) => {
  if (!adminEmail || !adminPassword) {
    test.skip();
    return;
  }

  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill(adminEmail);
  await page.getByLabel("Password").fill(adminPassword);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard\/overview$/);
  await expect(page.getByRole("heading", { name: "Your workspace at a glance" })).toBeVisible();
});
