import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/products", "/about", "/contact"];

for (const route of publicRoutes) {
  test(`${route} responds successfully without browser errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    // Hot reload is not part of the page smoke check; mock its socket so the
    // development server's HMR transport cannot add unrelated console noise.
    await page.routeWebSocket("**/_next/hmr**", () => {});
    const response = await page.goto(route);

    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
}
