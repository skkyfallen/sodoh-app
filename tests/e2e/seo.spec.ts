import { expect, test } from "@playwright/test";

const canonicalOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sodohnigerialtd.com").replace(/\/+$/, "");
const crawlers = [
  "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)",
];
const publicRoutes = ["/", "/products", "/about", "/contact"];
const suppressesSnippet = /\b(?:noindex|nosnippet|none)\b|\bmax-snippet\s*:\s*0\b/i;

for (const userAgent of crawlers) {
  test(`public pages are crawlable and provide descriptions to ${userAgent}`, async ({ playwright, baseURL }) => {
    const request = await playwright.request.newContext({ baseURL, userAgent });
    try {
      const robotsResponse = await request.get("/robots.txt");
      expect(robotsResponse.status()).toBe(200);
      const robots = await robotsResponse.text();
      expect(robots).toMatch(/User-Agent:\s*\*/i);
      expect(robots).toMatch(/Allow:\s*\/(?:\r?\n|$)/i);
      expect(robots.match(/^User-Agent:.*$/gim)).toEqual(["User-Agent: *"]);
      expect(robots.match(/^Disallow:.*$/gim)).toEqual(["Disallow: /admin", "Disallow: /api"]);
      expect(robots).toContain(`Sitemap: ${canonicalOrigin}/sitemap.xml`);

      const sitemapResponse = await request.get("/sitemap.xml");
      expect(sitemapResponse.status()).toBe(200);
      const sitemap = await sitemapResponse.text();

      for (const route of publicRoutes) {
        const response = await request.get(route);
        expect(response.status()).toBe(200);
        expect(response.headers()["x-robots-tag"] ?? "").not.toMatch(suppressesSnippet);
        const html = await response.text();
        expect(html).toMatch(/<meta name="description" content="[^\"]+"\s*\/?\s*>/i);
        const robotsTags = html.match(/<meta name="(?:robots|bingbot|duckduckbot)"[^>]*>/gi) ?? [];
        for (const tag of robotsTags) expect(tag).not.toMatch(suppressesSnippet);
        const canonical = route === "/" ? canonicalOrigin : `${canonicalOrigin}${route}`;
        const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
        expect(canonicalMatch).not.toBeNull();
        expect(new URL(canonicalMatch?.[1] ?? "").toString()).toBe(new URL(canonical).toString());
        expect(sitemap).toContain(`<loc>${canonical}</loc>`);
      }
    } finally {
      await request.dispose();
    }
  });
}
