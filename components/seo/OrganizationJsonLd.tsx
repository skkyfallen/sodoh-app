import { defaultLocale, email, phone, siteName, siteUrl } from "@/lib/site";

const organizationId = `${siteUrl}/#organization`;

const website = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  inLanguage: defaultLocale.replace("_", "-"),
  publisher: { "@id": organizationId },
};

const organization = {
  "@type": "Organization",
  "@id": organizationId,
  name: siteName,
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/brand/sodoh-mark.png`,
    width: 256,
    height: 256,
  },
  image: `${siteUrl}/brand/sodoh-mark.png`,
  email,
  telephone: phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abuja",
    addressRegion: "FCT",
    addressCountry: "NG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: phone,
    email,
    availableLanguage: ["English"],
  },
  knowsAbout: [
    "Agricultural produce",
    "Sesame seeds",
    "Cassava",
    "Cocoa",
    "Ginger",
    "Maize",
    "Yam",
    "Palm oil",
  ],
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [organization, website],
};

export default function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
