insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('product-documents', 'product-documents', false),
  ('user-icons', 'user-icons', false)
on conflict (id) do nothing;

-- product-images: admin write only (public read handled by the bucket's public flag)
create policy "product_images_admin_write" on storage.objects
  for all using (bucket_id = 'product-images' and public.is_admin(auth.uid()))
  with check (bucket_id = 'product-images' and public.is_admin(auth.uid()));

-- product-documents: private, admin-managed (downloads served via signed URLs from API routes)
create policy "product_documents_admin_all" on storage.objects
  for all using (bucket_id = 'product-documents' and public.is_admin(auth.uid()))
  with check (bucket_id = 'product-documents' and public.is_admin(auth.uid()));

-- user-icons: each user manages files under their own uid-prefixed folder; admins manage all
create policy "user_icons_owner_all" on storage.objects
  for all using (
    bucket_id = 'user-icons'
    and (public.is_admin(auth.uid()) or (storage.foldername(name))[1] = auth.uid()::text)
  )
  with check (
    bucket_id = 'user-icons'
    and (public.is_admin(auth.uid()) or (storage.foldername(name))[1] = auth.uid()::text)
  );
