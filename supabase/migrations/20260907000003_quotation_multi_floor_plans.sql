-- Support multiple labeled floor plans per quotation (e.g. "Ground Floor",
-- "1st Floor") instead of a single image. Each item in items[] that's
-- placed on a plan now also carries floor_id, tying its marker to one
-- specific floor's image.
alter table public.quotations add column floor_plans jsonb not null default '[]';

-- Migrate any existing single-plan-image rows into the new floor_plans
-- shape ("Floor 1"), tagging their already-positioned items with that new
-- floor's id so existing markers keep pointing at the right image.
do $$
declare
  r record;
  new_floor_id text;
begin
  for r in select id, plan_image_path from public.quotations where plan_image_path is not null loop
    new_floor_id := gen_random_uuid()::text;

    update public.quotations
    set floor_plans = jsonb_build_array(
          jsonb_build_object('id', new_floor_id, 'label', 'Floor 1', 'image_path', r.plan_image_path)
        ),
        items = (
          select coalesce(jsonb_agg(
            case
              when (item ? 'x_pct') and item->'x_pct' <> 'null'::jsonb
                then item || jsonb_build_object('floor_id', new_floor_id)
              else item
            end
          ), '[]'::jsonb)
          from jsonb_array_elements(items) as item
        )
    where id = r.id;
  end loop;
end $$;

alter table public.quotations drop column plan_image_path;
