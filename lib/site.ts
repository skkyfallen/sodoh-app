// Canonical public address. The workers.dev hostname is kept only as a
// fallback for previews; search engines should only ever see this domain.
const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sodohnigerialtd.com";

export const siteUrl = configuredSiteUrl.replace(/\/+$/, "");
export const siteName = "Sodoh Nigeria Limited";
// Optional: Google Search Console HTML-tag verification token (public value).
export const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
// Optional: Bing Webmaster (also powers Yahoo + DuckDuckGo) HTML-tag verification token.
export const bingSiteVerification = process.env.BING_SITE_VERIFICATION;
export const defaultLocale = "en_NG";
// Open Graph locale must be language_TERRITORY in OG format.
export const ogLocale = "en_US";
// Shared social preview image (absolute path resolved via metadataBase).
export const ogImagePath = "/brand/sodoh-mark.png";

export const phone = "+234 816 992 7344";
export const phoneTel = "+2348169927344";
export const email = "info@sodohnigerialtd.com";
export const city = "Abuja";
export const country = "Nigeria";
