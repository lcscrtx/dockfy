-- Clause library: reusable legal clauses by contract type

CREATE TABLE IF NOT EXISTS public.clause_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  contract_type TEXT NOT NULL DEFAULT 'geral',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clause_library_user_id
  ON public.clause_library(user_id);

CREATE INDEX IF NOT EXISTS idx_clause_library_contract_type
  ON public.clause_library(contract_type);

CREATE OR REPLACE FUNCTION public.set_clause_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_clause_library_updated_at ON public.clause_library;
CREATE TRIGGER trg_clause_library_updated_at
BEFORE UPDATE ON public.clause_library
FOR EACH ROW
EXECUTE FUNCTION public.set_clause_library_updated_at();

ALTER TABLE public.clause_library ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clause_library'
      AND policyname = 'clause_library_select_own'
  ) THEN
    CREATE POLICY clause_library_select_own ON public.clause_library
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clause_library'
      AND policyname = 'clause_library_insert_own'
  ) THEN
    CREATE POLICY clause_library_insert_own ON public.clause_library
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clause_library'
      AND policyname = 'clause_library_update_own'
  ) THEN
    CREATE POLICY clause_library_update_own ON public.clause_library
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clause_library'
      AND policyname = 'clause_library_delete_own'
  ) THEN
    CREATE POLICY clause_library_delete_own ON public.clause_library
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END
$$;
