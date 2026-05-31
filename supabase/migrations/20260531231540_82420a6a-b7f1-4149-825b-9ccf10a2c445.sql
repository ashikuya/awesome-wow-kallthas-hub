
-- =========================================================
-- PROFILES
-- =========================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  game_account text not null unique,
  display_name text,
  avatar_url text,
  faction text check (faction in ('alliance','horde')) default 'alliance',
  vote_points integer not null default 0,
  donor_coins integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_account text;
  final_account text;
  suffix integer := 0;
begin
  base_account := lower(coalesce(
    new.raw_user_meta_data->>'game_account',
    split_part(new.email, '@', 1)
  ));
  -- sanitize: only a-z 0-9
  base_account := regexp_replace(base_account, '[^a-z0-9]', '', 'g');
  if length(base_account) < 3 then
    base_account := 'player' || substr(new.id::text, 1, 6);
  end if;
  final_account := base_account;
  while exists (select 1 from public.profiles where game_account = final_account) loop
    suffix := suffix + 1;
    final_account := base_account || suffix::text;
  end loop;

  insert into public.profiles (id, game_account, display_name)
  values (
    new.id,
    final_account,
    coalesce(new.raw_user_meta_data->>'display_name', final_account)
  );
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- NEWS
-- =========================================================
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  body text,
  category text not null default 'announcement',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on public.news to anon, authenticated;
grant all on public.news to service_role;

alter table public.news enable row level security;

create policy "Published news visible to all"
  on public.news for select using (published = true);

-- =========================================================
-- VOTE LOGS
-- =========================================================
create table public.vote_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  site text not null,
  points_awarded integer not null default 1,
  voted_at timestamptz not null default now()
);

create index vote_logs_user_idx on public.vote_logs(user_id, voted_at desc);

grant select, insert on public.vote_logs to authenticated;
grant all on public.vote_logs to service_role;

alter table public.vote_logs enable row level security;

create policy "Users can view their own votes"
  on public.vote_logs for select using (auth.uid() = user_id);

create policy "Users can insert their own votes"
  on public.vote_logs for insert with check (auth.uid() = user_id);

-- Enforce 12h cooldown per site + award points to profile
create or replace function public.handle_vote()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  last_vote timestamptz;
begin
  select max(voted_at) into last_vote
  from public.vote_logs
  where user_id = new.user_id and site = new.site;

  if last_vote is not null and last_vote > now() - interval '12 hours' then
    raise exception 'You can vote on % only once every 12 hours.', new.site;
  end if;

  update public.profiles
    set vote_points = vote_points + new.points_awarded
    where id = new.user_id;

  return new;
end; $$;

create trigger vote_logs_before_insert
  before insert on public.vote_logs
  for each row execute function public.handle_vote();

-- =========================================================
-- REALM STATUS (single row cache)
-- =========================================================
create table public.realm_status (
  id integer primary key default 1,
  online boolean not null default true,
  players_online integer not null default 0,
  alliance_count integer not null default 0,
  horde_count integer not null default 0,
  uptime_seconds bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

grant select on public.realm_status to anon, authenticated;
grant all on public.realm_status to service_role;

alter table public.realm_status enable row level security;

create policy "Realm status public"
  on public.realm_status for select using (true);

-- Seed initial data
insert into public.realm_status (id, online, players_online, alliance_count, horde_count, uptime_seconds)
values (1, true, 1247, 612, 635, 1209600);

insert into public.news (title, excerpt, category) values
  ('Server Launch – Kael''thas ist offen!', 'Nach Monaten der Vorbereitung öffnet Kael''thas seine Tore. Tritt der Allianz oder der Horde bei und beginne dein Abenteuer.', 'announcement'),
  ('Icecrown Citadel — Phase IV Roadmap', 'Wir kündigen die Termine für ICC 10/25 Normal und Heroic an. Pre-Nerf Werte garantiert.', 'patch'),
  ('Double XP Wochenende', 'Dieses Wochenende läuft x2 XP auf allen Charakteren bis Level 79. Nutze die Zeit!', 'event');
