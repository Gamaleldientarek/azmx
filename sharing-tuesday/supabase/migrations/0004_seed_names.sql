-- 0004_seed_names.sql
-- Seed the 40 curated, halal-friendly fun names (see specs .../fun-names.md).
-- Idempotent: ON CONFLICT DO NOTHING keeps re-runs clean.

begin;

insert into public.name_pool (display_name)
values
  ('Brave Falcon'),
  ('Golden Oryx'),
  ('Swift Gazelle'),
  ('Clever Fox'),
  ('Noble Camel'),
  ('Bright Star'),
  ('Mighty Cedar'),
  ('Gentle Breeze'),
  ('Radiant Moon'),
  ('Bold Lion'),
  ('Wise Owl'),
  ('Happy Sparrow'),
  ('Kind Hawk'),
  ('Lucky Palm'),
  ('Sunny Dune'),
  ('Calm Oasis'),
  ('Royal Eagle'),
  ('Shining Pearl'),
  ('Quick Ibex'),
  ('Cheerful Robin'),
  ('Loyal Panther'),
  ('Silver Crane'),
  ('Merry Bee'),
  ('Cosmic Comet'),
  ('Amber Sunset'),
  ('Emerald Meadow'),
  ('Desert Rose'),
  ('Frosty Peak'),
  ('Jolly Dolphin'),
  ('Bright Lantern'),
  ('Steady Compass'),
  ('Warm Ember'),
  ('Nimble Deer'),
  ('Grand Mesa'),
  ('Velvet Night'),
  ('Coral Wave'),
  ('Sunlit Valley'),
  ('Bold Voyager'),
  ('Quiet Thunder'),
  ('Golden Horizon')
on conflict (display_name) do nothing;

commit;
