-- Synchronize public CMS content with the current page fallbacks.
-- site_content has uq_site_content_page_section on (page, section).
begin;

insert into public.site_content (page, section, content) values
  ('home', 'hero', '{
    "public_reviewed": true,
    "title": "Nigerian produce for your market",
    "subtitle": "Explore the current catalogue and contact our team to discuss product availability and supply requirements.",
    "cta_primary_text": "View products",
    "cta_primary_href": "/products",
    "cta_secondary_text": "Contact us",
    "cta_secondary_href": "/contact"
  }'::jsonb),
  ('products', 'hero', '{
    "public_reviewed": true,
    "title": "Products from Nigeria",
    "subtitle": "Browse the current catalogue and send an enquiry to discuss product availability and supply requirements.",
    "cta_primary_text": "Contact us",
    "cta_primary_href": "/contact"
  }'::jsonb),
  ('products', 'grid_heading', '{
    "public_reviewed": true,
    "heading": "Current catalogue"
  }'::jsonb),
  ('products', 'cta_banner', '{
    "public_reviewed": true,
    "heading": "Looking for something specific?",
    "cta_text": "Contact us",
    "cta_href": "/contact"
  }'::jsonb),
  ('about', 'hero', '{
    "public_reviewed": true,
    "title": "About Sodoh Nigeria",
    "subtitle": "Sodoh Nigeria Limited is an agricultural company. Explore the product catalogue and contact our team to discuss what you are looking for.",
    "cta_primary_text": "View products",
    "cta_primary_href": "/products",
    "cta_secondary_text": "Contact us",
    "cta_secondary_href": "/contact"
  }'::jsonb),
  ('about', 'operations', '{
    "public_reviewed": true,
    "heading": "A place to begin",
    "body": "Browse the products currently listed on our site, then contact our team with questions about availability, volumes, or partnership enquiries. Our team can discuss the details with you before you make a decision."
  }'::jsonb),
  ('about', 'values', '{
    "public_reviewed": true,
    "heading": "How to work with us",
    "items": [
      { "title": "Browse products", "description": "See the agricultural products currently listed in our catalogue." },
      { "title": "Share your needs", "description": "Tell our team which products, volumes, or partnership details you want to discuss." },
      { "title": "Talk through the details", "description": "Ask questions about the listed product and agree on next steps directly with our team." }
    ]
  }'::jsonb),
  ('about', 'cta_banner', '{
    "public_reviewed": true,
    "heading": "Have a question for our team?",
    "subtitle": "Get in touch about a product or partnership enquiry.",
    "cta_text": "Contact us",
    "cta_href": "/contact"
  }'::jsonb),
  ('contact', 'hero', '{
    "public_reviewed": true,
    "title": "Contact Sodoh Nigeria",
    "subtitle": "Tell us what you are looking for and our team will help direct your enquiry.",
    "cta_primary_text": "Send a message",
    "cta_primary_href": "#contact-form"
  }'::jsonb),
  ('contact', 'info', '{
    "public_reviewed": true,
    "details": [],
    "map_query": "Abuja, Nigeria"
  }'::jsonb)
on conflict (page, section) do update
set content = excluded.content;

insert into public.pillars (step, title, description, display_order, public_reviewed)
select seed.step, seed.title, seed.description, seed.display_order, true
from (values
  ('01', 'Browse products', 'See the agricultural products currently listed in the catalogue.', 1),
  ('02', 'Send an enquiry', 'Use a product request or contact form to share what you need.', 2),
  ('03', 'Discuss the details', 'Talk with our team about your requirements and the next step.', 3)
) as seed(step, title, description, display_order)
where not exists (
  select 1
  from public.pillars existing
  where existing.title = seed.title
);

commit;
