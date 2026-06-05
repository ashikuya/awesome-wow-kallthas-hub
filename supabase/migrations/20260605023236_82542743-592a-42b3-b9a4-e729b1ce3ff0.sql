
CREATE OR REPLACE FUNCTION public.forum_bump_thread()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.forum_threads SET last_post_at = NEW.created_at WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.forum_bump_thread() FROM PUBLIC, anon, authenticated;
