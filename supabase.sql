-- Vitrine · banco de dados no Supabase
-- Cole tudo no SQL Editor do Supabase e clique em Run (uma vez só).

-- 1. Tabela das vitrines publicadas
create table if not exists public.vitrines (
  id            text primary key,                  -- ex.: "vmhz3k2a1"
  dados         jsonb not null,                    -- nome, categoria, descrição, itens, posição no mapa…
  foto_url      text,                              -- endereço público da foto de capa
  token_edicao  text not null,                     -- link secreto do dono (para editar no futuro)
  oculta        boolean not null default false,    -- true = tirada do mapa pela moderação
  criada_em     timestamptz not null default now()
);
create index if not exists vitrines_recentes on public.vitrines (criada_em desc) where not oculta;

-- 2. Ninguém lê nem grava direto pelo navegador.
--    Só o servidor da Vercel, com a chave secreta, acessa a tabela.
alter table public.vitrines enable row level security;

-- 3. Pasta pública para as fotos de capa (até 2 MB, só imagens)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
