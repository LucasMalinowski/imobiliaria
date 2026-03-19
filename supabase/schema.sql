-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (admin users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  nome text,
  role text default 'admin',
  created_at timestamptz default now()
);

-- Properties table
create table imoveis (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  titulo text not null,
  descricao text,
  preco numeric(12,2) not null,
  finalidade text not null check (finalidade in ('venda', 'aluguel')),
  tipo text not null,
  status text not null default 'disponivel' check (status in ('disponivel', 'vendido', 'alugado', 'reservado')),
  destaque boolean default false,
  endereco text,
  cidade text,
  bairro text,
  cep text,
  quartos integer default 0,
  banheiros integer default 0,
  vagas integer default 0,
  area_total numeric(10,2),
  area_construida numeric(10,2),
  observacoes_internas text,
  publicado boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Property images table
create table imovel_imagens (
  id uuid primary key default uuid_generate_v4(),
  imovel_id uuid references imoveis(id) on delete cascade not null,
  url text not null,
  storage_path text not null,
  ordem integer default 0,
  principal boolean default false,
  created_at timestamptz default now()
);

-- Leads table
create table leads (
  id uuid primary key default uuid_generate_v4(),
  imovel_id uuid references imoveis(id) on delete set null,
  imovel_titulo text,
  nome text not null,
  email text,
  telefone text,
  mensagem text,
  lido boolean default false,
  created_at timestamptz default now()
);

-- Settings table
create table configuracoes (
  id uuid primary key default uuid_generate_v4(),
  chave text unique not null,
  valor text,
  updated_at timestamptz default now()
);

-- Default settings
insert into configuracoes (chave, valor) values
  ('whatsapp', '5511999999999'),
  ('nome_empresa', 'Imobiliária Premium'),
  ('email_contato', 'contato@imobiliaria.com.br'),
  ('endereco_empresa', 'Rua das Flores, 123 - São Paulo, SP'),
  ('instagram', ''),
  ('facebook', ''),
  ('slogan', 'Encontre o imóvel dos seus sonhos'),
  ('stat1_valor', '500+'),
  ('stat1_label', 'Imóveis disponíveis'),
  ('stat2_valor', '15+'),
  ('stat2_label', 'Anos de experiência'),
  ('stat3_valor', '2.000+'),
  ('stat3_label', 'Clientes satisfeitos'),
  ('stat4_valor', '98%'),
  ('stat4_label', 'Taxa de satisfação');

-- If schema already exists, insert missing stat keys only:
-- insert into configuracoes (chave, valor)
-- select * from (values
--   ('stat1_valor','500+'), ('stat1_label','Imóveis disponíveis'),
--   ('stat2_valor','15+'), ('stat2_label','Anos de experiência'),
--   ('stat3_valor','2.000+'), ('stat3_label','Clientes satisfeitos'),
--   ('stat4_valor','98%'), ('stat4_label','Taxa de satisfação')
-- ) as v(chave, valor)
-- on conflict (chave) do nothing;

-- RLS Policies
alter table profiles enable row level security;
alter table imoveis enable row level security;
alter table imovel_imagens enable row level security;
alter table leads enable row level security;
alter table configuracoes enable row level security;

-- Public can read published properties
create policy "imoveis_public_read" on imoveis
  for select using (publicado = true);

-- Admins can do everything on imoveis
create policy "imoveis_admin_all" on imoveis
  for all using (auth.role() = 'authenticated');

-- Public can read images of published properties
create policy "imagens_public_read" on imovel_imagens
  for select using (
    exists (select 1 from imoveis where id = imovel_id and publicado = true)
  );

-- Admins can do everything on images
create policy "imagens_admin_all" on imovel_imagens
  for all using (auth.role() = 'authenticated');

-- Anyone can create leads
create policy "leads_insert" on leads
  for insert with check (true);

-- Only admins can read/update leads
create policy "leads_admin_read" on leads
  for select using (auth.role() = 'authenticated');

create policy "leads_admin_update" on leads
  for update using (auth.role() = 'authenticated');

-- Public can read settings
create policy "config_public_read" on configuracoes
  for select using (true);

-- Admins can update settings
create policy "config_admin_update" on configuracoes
  for update using (auth.role() = 'authenticated');

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger imoveis_updated_at
  before update on imoveis
  for each row execute function update_updated_at();

-- Storage bucket setup (run in Supabase dashboard)
-- Create bucket 'imoveis-imagens' with public access
-- insert into storage.buckets (id, name, public) values ('imoveis-imagens', 'imoveis-imagens', true);
