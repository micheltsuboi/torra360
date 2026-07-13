-- Criar tabela para atividade de keep alive do Supabase
CREATE TABLE IF NOT EXISTS public.supabase_keep_alive (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  dummy_data text DEFAULT 'keep-alive'
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.supabase_keep_alive ENABLE ROW LEVEL SECURITY;

-- Permitir qualquer operação para manter o controle simples, 
-- mas como o n8n usará a Service Role Key, ele já possui bypass automático de RLS.
CREATE POLICY "SupabaseKeepAlive All" ON public.supabase_keep_alive FOR ALL USING (true);
