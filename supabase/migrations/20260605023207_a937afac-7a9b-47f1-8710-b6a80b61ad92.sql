
-- Categories
CREATE TABLE public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forum_categories TO anon, authenticated;
GRANT ALL ON public.forum_categories TO service_role;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories readable by all" ON public.forum_categories FOR SELECT USING (true);

-- Boards
CREATE TABLE public.forum_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'message-square',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.forum_boards TO anon, authenticated;
GRANT ALL ON public.forum_boards TO service_role;
ALTER TABLE public.forum_boards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Boards readable by all" ON public.forum_boards FOR SELECT USING (true);
CREATE INDEX idx_forum_boards_category ON public.forum_boards(category_id, sort_order);

-- Threads
CREATE TABLE public.forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES public.forum_boards(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  title text NOT NULL,
  sticky boolean NOT NULL DEFAULT false,
  locked boolean NOT NULL DEFAULT false,
  view_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_post_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.forum_threads TO authenticated;
GRANT SELECT ON public.forum_threads TO anon;
GRANT ALL ON public.forum_threads TO service_role;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Threads readable by all" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Auth users create threads" ON public.forum_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors edit own thread" ON public.forum_threads FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE INDEX idx_forum_threads_board ON public.forum_threads(board_id, sticky DESC, last_post_at DESC);

-- Posts
CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  edited_at timestamptz
);
GRANT SELECT, INSERT, UPDATE ON public.forum_posts TO authenticated;
GRANT SELECT ON public.forum_posts TO anon;
GRANT ALL ON public.forum_posts TO service_role;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts readable by all" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Auth users create posts" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors edit own post" ON public.forum_posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE INDEX idx_forum_posts_thread ON public.forum_posts(thread_id, created_at ASC);

-- Bump thread last_post_at on new post
CREATE OR REPLACE FUNCTION public.forum_bump_thread()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.forum_threads SET last_post_at = NEW.created_at WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_forum_bump AFTER INSERT ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.forum_bump_thread();

-- Aggregate views for board listings (counts via SQL views)
CREATE OR REPLACE VIEW public.forum_board_stats AS
SELECT b.id AS board_id,
  COUNT(DISTINCT t.id) AS thread_count,
  COUNT(p.id) AS post_count,
  MAX(p.created_at) AS last_post_at
FROM public.forum_boards b
LEFT JOIN public.forum_threads t ON t.board_id = b.id
LEFT JOIN public.forum_posts p ON p.thread_id = t.id
GROUP BY b.id;
GRANT SELECT ON public.forum_board_stats TO anon, authenticated;

CREATE OR REPLACE VIEW public.forum_thread_stats AS
SELECT t.id AS thread_id,
  COUNT(p.id) AS post_count,
  MAX(p.created_at) AS last_post_at,
  (SELECT author_id FROM public.forum_posts WHERE thread_id = t.id ORDER BY created_at DESC LIMIT 1) AS last_post_user_id
FROM public.forum_threads t
LEFT JOIN public.forum_posts p ON p.thread_id = t.id
GROUP BY t.id;
GRANT SELECT ON public.forum_thread_stats TO anon, authenticated;

-- Seed categories & boards
WITH cats AS (
  INSERT INTO public.forum_categories (name, sort_order) VALUES
    ('Allgemein', 1),
    ('Spielwelt', 2),
    ('Community', 3)
  RETURNING id, name
)
INSERT INTO public.forum_boards (category_id, name, description, icon, sort_order)
SELECT c.id, b.name, b.descr, b.icon, b.ord FROM cats c
JOIN (VALUES
  ('Allgemein', 'Ankündigungen', 'Offizielle News & Server-Ankündigungen', 'megaphone', 1),
  ('Allgemein', 'Regeln & FAQ', 'Server-Regeln und häufig gestellte Fragen', 'scroll', 2),
  ('Spielwelt', 'PvE & Raids', 'Icecrown Citadel, Ulduar & Co. — Taktiken und Berichte', 'sword', 1),
  ('Spielwelt', 'PvP & Battlegrounds', 'Arena, BGs, Wintergrasp', 'shield', 2),
  ('Spielwelt', 'Klassen & Builds', 'Theorycrafting für alle 10 Klassen', 'sparkles', 3),
  ('Community', 'Gilden & Recruiting', 'Suche Gilde — biete Gilde', 'users', 1),
  ('Community', 'Off-Topic', 'Alles ausserhalb von Azeroth', 'coffee', 2)
) AS b(cat, name, descr, icon, ord) ON b.cat = c.name;
