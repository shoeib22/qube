-- Support multiple labeled floor plans per quotation (e.g. "Ground Floor",
-- "1st Floor") instead of a single image. Each item in items[] that's
-- placed on a plan now also carries floor_id, tying its marker to one
-- specific floor's image.
alter table public.quotations drop column plan_image_path;
alter table public.quotations add column floor_plans jsonb not null default '[]';
-- floor_plans: [{ id: text, label: text, image_path: text }]
