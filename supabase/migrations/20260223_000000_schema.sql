-- Dockfy base schema (frontend-aligned entities)
-- Requires Supabase/Postgres with access to auth.users

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY,
  schema_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('rascunho', 'gerado', 'enviado', 'assinado')),
  value TEXT NOT NULL DEFAULT '-',
  markdown_content TEXT NOT NULL DEFAULT '',
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  data_vencimento DATE NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id TEXT NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  markdown_content TEXT NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  version_number INTEGER NOT NULL CHECK (version_number > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.custom_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NULL,
  markdown_template TEXT NOT NULL,
  fields_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (
    tipo IN ('fisica', 'juridica', 'proprietario', 'inquilino', 'comprador', 'vendedor', 'generico')
  ),
  cpf_cnpj TEXT NOT NULL DEFAULT '',
  rg TEXT NOT NULL DEFAULT '',
  estado_civil TEXT NOT NULL DEFAULT '',
  profissao TEXT NOT NULL DEFAULT '',
  endereco TEXT NOT NULL DEFAULT '',
  cidade TEXT NULL,
  estado TEXT NULL,
  cep TEXT NULL,
  nacionalidade TEXT NULL,
  regime_bens TEXT NOT NULL DEFAULT '',
  telefone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  apelido TEXT NOT NULL,
  endereco TEXT NOT NULL DEFAULT '',
  cep TEXT NOT NULL DEFAULT '',
  cidade TEXT NOT NULL DEFAULT '',
  estado TEXT NOT NULL DEFAULT '',
  bairro TEXT NOT NULL DEFAULT '',
  tipo TEXT NOT NULL CHECK (tipo IN ('residencial', 'comercial', 'industrial', 'terreno', 'rural')),
  area_total TEXT NOT NULL DEFAULT '',
  area_construida TEXT NOT NULL DEFAULT '',
  matricula TEXT NOT NULL DEFAULT '',
  iptu TEXT NOT NULL DEFAULT '',
  descricao TEXT NOT NULL DEFAULT '',
  proprietario_id UUID NULL REFERENCES public.personas(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recebimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  imovel_id UUID NULL REFERENCES public.imoveis(id) ON DELETE SET NULL,
  locatario_id UUID NULL REFERENCES public.personas(id) ON DELETE SET NULL,
  documento_id TEXT NULL REFERENCES public.documents(id) ON DELETE SET NULL,
  valor NUMERIC(12, 2) NOT NULL CHECK (valor >= 0),
  data_vencimento DATE NOT NULL,
  data_pagamento DATE NULL,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'pago', 'atrasado')),
  referencia_mes_ano TEXT NOT NULL,
  descricao TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_user_id ON public.document_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_templates_user_id ON public.custom_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON public.personas(user_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_user_id ON public.imoveis(user_id);
CREATE INDEX IF NOT EXISTS idx_recebimentos_user_id ON public.recebimentos(user_id);
CREATE INDEX IF NOT EXISTS idx_recebimentos_data_vencimento ON public.recebimentos(data_vencimento);
