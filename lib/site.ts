const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://sodoh-app.kenzemadrt.workers.dev";

export const siteUrl = configuredSiteUrl.replace(/\/+$/, "");
export const siteName = "Sodoh Nigeria Limited";
export const defaultLocale = "en_NG";

export const phone = "+234 816 992 7344";
export const phoneTel = "+2348169927344";
export const email = "info@sodohnigeria.com";
export const city = "Abuja";
export const country = "Nigeria";
