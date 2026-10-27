-- ============================================================
-- Sodoh Nigeria — About Page Seed Data
-- Run AFTER schema.sql to populate About page content.
-- Uses ON CONFLICT DO NOTHING so it's safe to re-run.
-- ============================================================

-- ABOUT — hero section
insert into public.site_content (page, section, content) values
('about', 'hero', '{
  "public_reviewed": true,
  "title": "About Sodoh Nigeria",
  "subtitle": "Sodoh Nigeria Limited is an agricultural company. Explore the product catalogue and contact our team to discuss what you are looking for.",
  "cta_primary_text": "View products",
  "cta_primary_href": "/products",
  "cta_secondary_text": "Contact us",
  "cta_secondary_href": "/contact"
}'::jsonb)
on conflict (page, section) do nothing;

-- ABOUT — operations
insert into public.site_content (page, section, content) values
('about', 'operations', '{
  "public_reviewed": true,
  "heading": "A place to begin",
  "body": "Browse the products currently listed on our site, then contact our team with questions about availability, volumes, or partnership enquiries. Our team can discuss the details with you before you make a decision."
}'::jsonb)
on conflict (page, section) do nothing;

-- ABOUT — timeline
insert into public.site_content (page, section, content) values
('about', 'timeline', '{
  "heading": "Our Journey",
  "milestones": [
    { "year": "2015", "title": "Founded",                  "description": "Sodoh Nigeria Limited is established with a bold mission to modernise Nigerian agriculture and connect local produce to global markets." },
    { "year": "2017", "title": "First Export Contract",    "description": "Achieved our first international export milestone, supplying premium cassava and yam to European distribution partners." },
    { "year": "2019", "title": "Farm Expansion",           "description": "Expanded operations across three new states, entering formal partnerships with over 500 smallholder farmers." },
    { "year": "2022", "title": "Sustainability Certified", "description": "Received organic and sustainable farming certification across our core product lines after a comprehensive audit." },
    { "year": "2024", "title": "Regional Leader",          "description": "Recognised as one of Nigeria''s leading agricultural export companies, with active operations spanning 12 states." }
  ]
}'::jsonb)
on conflict (page, section) do nothing;

-- ABOUT — core values
insert into public.site_content (page, section, content) values
('about', 'values', '{
  "public_reviewed": true,
  "heading": "How to work with us",
  "items": [
    { "title": "Browse products", "description": "See the agricultural products currently listed in our catalogue." },
    { "title": "Share your needs", "description": "Tell our team which products, volumes, or partnership details you want to discuss." },
    { "title": "Talk through the details", "description": "Ask questions about the listed product and agree on next steps directly with our team." }
  ]
}'::jsonb)
on conflict (page, section) do nothing;

-- ABOUT — CTA banner
insert into public.site_content (page, section, content) values
('about', 'cta_banner', '{
  "public_reviewed": true,
  "heading": "Have a question for our team?",
  "subtitle": "Get in touch about a product or partnership enquiry.",
  "cta_text": "Contact us",
  "cta_href": "/contact"
}'::jsonb)
on conflict (page, section) do nothing;

-- ABOUT — key people
insert into public.site_content (page, section, content) values
('about', 'people', '{
  "heading": "Meet the Team",
  "members": [
    {
      "name": "Emmanuel Odoh",
      "role": "Founder & Chief Executive Officer",
      "bio": "Emmanuel founded Sodoh Nigeria Limited with a vision to modernise Nigerian agriculture and connect homegrown produce to global markets. He brings over a decade of experience in agribusiness and supply chain management."
    },
    {
      "name": "Adaeze Okonkwo",
      "role": "Director of Operations",
      "bio": "Adaeze oversees farm partnerships, logistics, and quality control across all 12 states of operation. Her background in agricultural science ensures every product meets rigorous international standards."
    },
    {
      "name": "Tunde Balogun",
      "role": "Head of Export & Trade",
      "bio": "Tunde leads Sodoh''s international trade relationships, managing export contracts across Europe and Asia. He holds an MBA in International Trade and has closed over ₦2.5B in export deals."
    }
  ]
}'::jsonb)
on conflict (page, section) do nothing;
