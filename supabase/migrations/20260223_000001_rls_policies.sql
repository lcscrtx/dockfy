-- Dockfy: baseline multi-tenant protection for user-scoped tables.
-- Apply this migration in Supabase before production rollout.

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'documents',
    'document_versions',
    'custom_templates',
    'personas',
    'imoveis',
    'recebimentos'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = t
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    END IF;
  END LOOP;
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'documents') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'documents' AND policyname = 'documents_select_own') THEN
      CREATE POLICY documents_select_own ON public.documents
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'documents' AND policyname = 'documents_insert_own') THEN
      CREATE POLICY documents_insert_own ON public.documents
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'documents' AND policyname = 'documents_update_own') THEN
      CREATE POLICY documents_update_own ON public.documents
        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'documents' AND policyname = 'documents_delete_own') THEN
      CREATE POLICY documents_delete_own ON public.documents
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'document_versions') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'document_versions' AND policyname = 'document_versions_select_own') THEN
      CREATE POLICY document_versions_select_own ON public.document_versions
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'document_versions' AND policyname = 'document_versions_insert_own') THEN
      CREATE POLICY document_versions_insert_own ON public.document_versions
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'document_versions' AND policyname = 'document_versions_update_own') THEN
      CREATE POLICY document_versions_update_own ON public.document_versions
        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'document_versions' AND policyname = 'document_versions_delete_own') THEN
      CREATE POLICY document_versions_delete_own ON public.document_versions
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_templates') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'custom_templates' AND policyname = 'custom_templates_select_own') THEN
      CREATE POLICY custom_templates_select_own ON public.custom_templates
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'custom_templates' AND policyname = 'custom_templates_insert_own') THEN
      CREATE POLICY custom_templates_insert_own ON public.custom_templates
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'custom_templates' AND policyname = 'custom_templates_update_own') THEN
      CREATE POLICY custom_templates_update_own ON public.custom_templates
        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'custom_templates' AND policyname = 'custom_templates_delete_own') THEN
      CREATE POLICY custom_templates_delete_own ON public.custom_templates
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'personas') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'personas' AND policyname = 'personas_select_own') THEN
      CREATE POLICY personas_select_own ON public.personas
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'personas' AND policyname = 'personas_insert_own') THEN
      CREATE POLICY personas_insert_own ON public.personas
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'personas' AND policyname = 'personas_update_own') THEN
      CREATE POLICY personas_update_own ON public.personas
        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'personas' AND policyname = 'personas_delete_own') THEN
      CREATE POLICY personas_delete_own ON public.personas
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'imoveis') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'imoveis' AND policyname = 'imoveis_select_own') THEN
      CREATE POLICY imoveis_select_own ON public.imoveis
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'imoveis' AND policyname = 'imoveis_insert_own') THEN
      CREATE POLICY imoveis_insert_own ON public.imoveis
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'imoveis' AND policyname = 'imoveis_update_own') THEN
      CREATE POLICY imoveis_update_own ON public.imoveis
        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'imoveis' AND policyname = 'imoveis_delete_own') THEN
      CREATE POLICY imoveis_delete_own ON public.imoveis
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'recebimentos') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'recebimentos' AND policyname = 'recebimentos_select_own') THEN
      CREATE POLICY recebimentos_select_own ON public.recebimentos
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'recebimentos' AND policyname = 'recebimentos_insert_own') THEN
      CREATE POLICY recebimentos_insert_own ON public.recebimentos
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'recebimentos' AND policyname = 'recebimentos_update_own') THEN
      CREATE POLICY recebimentos_update_own ON public.recebimentos
        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'recebimentos' AND policyname = 'recebimentos_delete_own') THEN
      CREATE POLICY recebimentos_delete_own ON public.recebimentos
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
  END IF;
END
$$;
