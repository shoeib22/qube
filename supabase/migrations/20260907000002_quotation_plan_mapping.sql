-- Floor-plan mapping for quotations: admins upload a plan image and manually
-- place priced products on it. Placement lives on the existing `items` jsonb
-- array (each item optionally carries product_id/image_url/x_pct/y_pct) --
-- no new table needed, a placed product *is* a line item.
alter table public.quotations add column plan_image_path text;

insert into storage.buckets (id, name, public)
values ('quotation-plans', 'quotation-plans', true)
on conflict (id) do nothing;

-- public read (bucket is public), admin-only write -- same pattern as product-images.
create policy "quotation_plans_admin_write" on storage.objects
  for all using (bucket_id = 'quotation-plans' and public.is_admin(auth.uid()))
  with check (bucket_id = 'quotation-plans' and public.is_admin(auth.uid()));
