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
-- Garante que o servidor (chave secreta) consegue ler e gravar, mesmo nos projetos novos
-- em que o Supabase não libera tabelas novas automaticamente.
grant select, insert, update on public.vitrines to service_role;

-- 3. Pasta pública para as fotos de capa (até 2 MB, só imagens)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- 4. Login com Google: cada vitrine pode ter um dono (quem estava logado ao publicar).
--    Pode rodar só este bloco se o resto já foi rodado antes.
alter table public.vitrines add column if not exists dono_id uuid references auth.users(id) on delete set null;
create index if not exists vitrines_dono on public.vitrines (dono_id);
grant select, insert, update on public.vitrines to service_role;

-- 5. Denúncias e ouvidoria: cada manifestação ganha um protocolo.
--    Pode rodar só este bloco se o resto já foi rodado antes.
create table if not exists public.manifestacoes (
  id          bigint generated always as identity primary key,
  protocolo   text unique not null,                      -- ex.: VT-261127-K7P2Q
  tipo        text not null check (tipo in ('denuncia', 'reclamacao', 'sugestao', 'elogio', 'dados')),
  vitrine_id  text references public.vitrines(id) on delete set null,
  motivo      text,                                      -- só nas denúncias
  mensagem    text,
  contato     text,                                      -- opcional, para dar retorno
  ip_hash     text,                                      -- resumo do IP (nunca o IP), para contar pessoas diferentes
  status      text not null default 'aberta' check (status in ('aberta', 'resolvida', 'arquivada')),
  criada_em   timestamptz not null default now()
);
create index if not exists manifestacoes_vitrine on public.manifestacoes (vitrine_id) where status = 'aberta';
alter table public.manifestacoes enable row level security;
grant select, insert, update on public.manifestacoes to service_role;
grant usage, select on all sequences in schema public to service_role;

-- 6. Avaliações dos vizinhos (1 por pessoa por vitrine).
--    Pode rodar só este bloco se o resto já foi rodado antes.
create table if not exists public.avaliacoes (
  id            bigint generated always as identity primary key,
  vitrine_id    text not null references public.vitrines(id) on delete cascade,
  nota          smallint not null check (nota between 1 and 5),
  texto         text,
  autor         text,                                   -- primeiro nome, opcional
  apos_contato  boolean not null default false,         -- avaliou depois de chamar/agendar pelo app
  ip_hash       text not null,                          -- resumo do IP, para 1 avaliação por pessoa
  oculta        boolean not null default false,         -- moderação
  criada_em     timestamptz not null default now(),
  unique (vitrine_id, ip_hash)
);
create index if not exists avaliacoes_vitrine on public.avaliacoes (vitrine_id, criada_em desc);
alter table public.avaliacoes enable row level security;
grant select, insert, update on public.avaliacoes to service_role;
grant usage, select on all sequences in schema public to service_role;
