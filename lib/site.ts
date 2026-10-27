// Canonical public address. The workers.dev hostname is kept only as a
// fallback for previews; search engines should only ever see this domain.
const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sodohnigerialtd.com";

export const siteUrl = configuredSiteUrl.replace(/\/+$/, "");
export const siteName = "Sodoh Nigeria Limited";
// Optional: Google Search Console HTML-tag verification token (public value).
export const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
export const defaultLocale = "en_NG";

export const phone = "+234 816 992 7344";
export const phoneTel = "+2348169927344";
export const email = "info@sodohnigerialtd.com";
export const city = "Abuja";
export const country = "Nigeria";
