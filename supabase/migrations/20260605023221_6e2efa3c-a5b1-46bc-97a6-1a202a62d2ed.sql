
ALTER VIEW public.forum_board_stats SET (security_invoker = true);
ALTER VIEW public.forum_thread_stats SET (security_invoker = true);

CREATE OR REPLACE FUNCTION public.forum_bump_thread()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  UPDATE public.forum_threads SET last_post_at = NEW.created_at WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;
