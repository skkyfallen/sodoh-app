-- ============================================================
-- Sodoh Nigeria — Seed Data
-- Run AFTER schema.sql to populate initial content.
-- Uses ON CONFLICT DO NOTHING so it's safe to re-run.
-- ============================================================

-- ──────────────────────────────────────────────────
-- SITE CONTENT  (hero text, announcements, CTAs)
-- ──────────────────────────────────────────────────

-- HOME — announcement bar
insert into public.site_content (page, section, content) values
('home', 'announcement', '{
  "text": "Sodoh Nigeria is now accepting bulk B2B orders for the 2026 harvest season.",
  "link_text": "Enquire Now →",
  "link_href": "/contact"
}'::jsonb)
on conflict (page, section) do nothing;

-- HOME — hero section
insert into public.site_content (page, section, content) values
('home', 'hero', '{
  "public_reviewed": true,
  "title": "Nigerian produce for your market",
  "subtitle": "Explore the current catalogue and contact our team to discuss product availability and supply requirements.",
  "cta_primary_text": "View products",
  "cta_primary_href": "/products",
  "cta_secondary_text": "Contact us",
  "cta_secondary_href": "/contact"
}'::jsonb)
on conflict (page, section) do nothing;

-- HOME — quality guarantee heading
insert into public.site_content (page, section, content) values
('home', 'quality_guarantee', '{
  "heading": "Quality Guarantee"
}'::jsonb)
on conflict (page, section) do nothing;

-- HOME — stats section heading (the dark full-width band)
insert into public.site_content (page, section, content) values
('home', 'stats_section', '{
  "heading": ""
}'::jsonb)
on conflict (page, section) do nothing;

-- HOME — testimonial
insert into public.site_content (page, section, content) values
('home', 'testimonial', '{
  "quote": "Partnering with Sodoh Nigeria Limited has transformed my yield and my livelihood. Their commitment to sustainable practices and fair market access is unparalleled in the Nigerian agricultural space.",
  "author_name": "Alhaji Ibrahim Musa",
  "author_role": "Cooperative Lead, Kaduna State",
  "author_image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCmndSEiKe_WOsMlOF8v5eSFPgHupEPHjzpYbJNPkWj_iJQcgVi4nxgUrdVT-DxtFDxRE5Z8I_1sbPnj7W-8FK--EXGMwiVc7aCcviDA03v52ruX8SKpi2z_YTBkJHSAMsv3Lg8prUwB98-jiEeQZ8dugVz9mKHWKBTw3V0DATKMl-maH031hANukkQ5Ctb9TSomHs5YwNImJwmvTEroxRqrfY8xX6lS19Xv9cn8ERCIp6waZ9BV07TGoJAlgyBGF7hVcvW2CTif8TF"
}'::jsonb)
on conflict (page, section) do nothing;

-- PRODUCTS — hero section
insert into public.site_content (page, section, content) values
('products', 'hero', '{
  "public_reviewed": true,
  "title": "Products from Nigeria",
  "subtitle": "Browse the current catalogue and send an enquiry to discuss product availability and supply requirements.",
  "cta_primary_text": "Contact us",
  "cta_primary_href": "/contact"
}'::jsonb)
on conflict (page, section) do nothing;

-- PRODUCTS — grid heading
insert into public.site_content (page, section, content) values
('products', 'grid_heading', '{
  "public_reviewed": true,
  "heading": "Current catalogue"
}'::jsonb)
on conflict (page, section) do nothing;

-- PRODUCTS — CTA banner
insert into public.site_content (page, section, content) values
('products', 'cta_banner', '{
  "public_reviewed": true,
  "heading": "Looking for something specific?",
  "cta_text": "Contact us",
  "cta_href": "/contact"
}'::jsonb)
on conflict (page, section) do nothing;

-- CONTACT — hero section
insert into public.site_content (page, section, content) values
('contact', 'hero', '{
  "public_reviewed": true,
  "title": "Contact Sodoh Nigeria",
  "subtitle": "Tell us what you are looking for and our team will help direct your enquiry.",
  "cta_primary_text": "Send a message",
  "cta_primary_href": "#contact-form"
}'::jsonb)
on conflict (page, section) do nothing;

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
    { "year": "2015", "title": "Founded",               "description": "Sodoh Nigeria Limited is established with a bold mission to modernise Nigerian agriculture and connect local produce to global markets." },
    { "year": "2017", "title": "First Export Contract", "description": "Achieved our first international export milestone, supplying premium cassava and yam to European distribution partners." },
    { "year": "2019", "title": "Farm Expansion",        "description": "Expanded operations across three new states, entering formal partnerships with over 500 smallholder farmers." },
    { "year": "2022", "title": "Sustainability Certified", "description": "Received organic and sustainable farming certification across our core product lines after a comprehensive audit." },
    { "year": "2024", "title": "Regional Leader",       "description": "Recognised as one of Nigeria''s leading agricultural export companies, with active operations spanning 12 states." }
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

-- CONTACT — contact info
insert into public.site_content (page, section, content) values
('contact', 'info', '{
  "public_reviewed": true,
  "details": [],
  "map_query": "Abuja, Nigeria"
}'::jsonb)
on conflict (page, section) do nothing;

-- ──────────────────────────────────────────────────
-- PRODUCTS
-- ──────────────────────────────────────────────────

insert into public.products (title, slug, region, description, image_url, image_alt, icon, display_order) values
(
  'Cassava Tubers',
  'cassava-tubers',
  'South-Western Nigeria',
  'Premium quality cassava harvested from nutrient-rich soils, ideal for starch, flour, and garri production.',
  'https://images.unsplash.com/photo-1596711739829-37315582c031?q=80&w=800&auto=format&fit=crop',
  'Fresh Cassava Tubers',
  'MdEco',
  1
),
(
  'Yellow Maize',
  'yellow-maize',
  'Middle Belt Region',
  'High-energy yellow maize dried to perfection, sourced directly from our partner farms in the Middle Belt.',
  'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&auto=format&fit=crop',
  'Yellow Maize kernels',
  'MdGrass',
  2
),
(
  'Fresh Ginger',
  'fresh-ginger',
  'Kaduna State',
  'Aromatic and spicy ginger roots cleaned and processed to meet international export standards.',
  'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
  'Fresh Ginger roots',
  'MdSpa',
  3
),
(
  'Cocoa Beans',
  'cocoa-beans',
  'Ondo State',
  'Grade-A cocoa beans fermented and sun-dried in the traditional way from the lush forests of Ondo State.',
  'https://images.unsplash.com/photo-1589227365423-d98601614838?q=80&w=800&auto=format&fit=crop',
  'Dried Cocoa Beans',
  'MdLocalCafe',
  4
),
(
  'Palm Oil',
  'palm-oil',
  'Edo State',
  'Unadulterated, cholesterol-free red palm oil extracted from fresh fruit bunches in the heart of Edo State.',
  'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=800&auto=format&fit=crop',
  'Pure Red Palm Oil',
  'MdOpacity',
  5
),
(
  'Yam Tubers',
  'yam-tubers',
  'Benue Valley',
  'Large, firm, and starchy Puna yam tubers sourced from the Benue valley — the food basket of the nation.',
  'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=800&auto=format&fit=crop',
  'Large Yam Tubers',
  'MdDinnerDining',
  6
)
on conflict (slug) do nothing;

-- ──────────────────────────────────────────────────
-- STATS
-- ──────────────────────────────────────────────────

insert into public.stats (value, label, sub, display_order) values
('500+', 'Farms Partnered',  'Across 12 Nigerian states',          1),
('12',   'States Served',    'North, South, East and West',        2),
('98%',  'On-Time Delivery', 'Cold-chain monitored end-to-end',    3)
on conflict do nothing;

-- ──────────────────────────────────────────────────
-- PILLARS  (Quality Guarantee)
-- ──────────────────────────────────────────────────

insert into public.pillars (step, title, description, display_order, public_reviewed) values
('01', 'Browse products', 'See the agricultural products currently listed in the catalogue.', 1, true),
('02', 'Send an enquiry', 'Use a product request or contact form to share what you need.', 2, true),
('03', 'Discuss the details', 'Talk with our team about your requirements and the next step.', 3, true)
on conflict do nothing;

-- ──────────────────────────────────────────────────
-- FAQS
-- ──────────────────────────────────────────────────

insert into public.faqs (question, answer, display_order) values
('How do I start a partnership with Sodoh Nigeria Limited?', 'Simply fill out our contact form or send a detailed proposal to our partnership email. Our team typically reviews and responds to all partnership inquiries within 3–5 business days.', 1),
('Do you provide logistics support for small-scale farmers?', 'Yes, we offer integrated supply chain solutions specifically designed to help small-scale farmers get their products to market efficiently and profitably.', 2),
('Are your farming methods 100% sustainable?', 'Sustainability is at our core. We utilise regenerative agriculture practices, solar-powered irrigation, and organic pest control methods across all our managed sites.', 3),
('Can I visit your Abuja office for a physical consultation?', 'While we prefer scheduled appointments, our doors are open for consultations Monday through Friday from 9:00 AM to 4:00 PM.', 4)
on conflict do nothing;

-- ──────────────────────────────────────────────────
-- TESTIMONIALS
-- ──────────────────────────────────────────────────

insert into public.testimonials (quote, author_name, author_role, author_image, display_order) values
(
  'Partnering with Sodoh Nigeria Limited has transformed my yield and my livelihood. Their commitment to sustainable practices and fair market access is unparalleled in the Nigerian agricultural space.',
  'Alhaji Ibrahim Musa',
  'Cooperative Lead, Kaduna State',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCmndSEiKe_WOsMlOF8v5eSFPgHupEPHjzpYbJNPkWj_iJQcgVi4nxgUrdVT-DxtFDxRE5Z8I_1sbPnj7W-8FK--EXGMwiVc7aCcviDA03v52ruX8SKpi2z_YTBkJHSAMsv3Lg8prUwB98-jiEeQZ8dugVz9mKHWKBTw3V0DATKMl-maH031hANukkQ5Ctb9TSomHs5YwNImJwmvTEroxRqrfY8xX6lS19Xv9cn8ERCIp6waZ9BV07TGoJAlgyBGF7hVcvW2CTif8TF',
  1
)
on conflict do nothing;
