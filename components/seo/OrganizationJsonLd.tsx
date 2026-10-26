import { email, phone, siteName, siteUrl } from "@/lib/site";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
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

export default function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
      }}
    />
  );
}
