-- Owner verification (MVP)
-- Apply this in Supabase SQL editor (this repo currently has no migrations).

create table if not exists public.owner_verifications (
  user_id uuid primary key references auth.users (id) on delete cascade,
  status text not null default 'UNSUBMITTED' check (status in ('UNSUBMITTED','PENDING','APPROVED','REJECTED')),
  business_number text,
  shop_name text,
  owner_name text,
  contact_phone text,
  business_license_path text,
  rejected_reason text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.owner_verifications enable row level security;

-- Owners can read their own record.
drop policy if exists "owner_verifications_select_own" on public.owner_verifications;
create policy "owner_verifications_select_own"
on public.owner_verifications
for select
to authenticated
using (user_id = auth.uid());

-- Owners can insert their own record.
drop policy if exists "owner_verifications_insert_own" on public.owner_verifications;
create policy "owner_verifications_insert_own"
on public.owner_verifications
for insert
to authenticated
with check (user_id = auth.uid());

-- Owners can update their own record, but cannot self-approve.
drop policy if exists "owner_verifications_update_own_pending_only" on public.owner_verifications;
create policy "owner_verifications_update_own_pending_only"
on public.owner_verifications
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and status in ('PENDING'));

-- Notes:
-- 1) Admin approval should be done via dashboard/service role (out of owner-app scope).
-- 2) Create a private Storage bucket "owner-licenses" and add object policies:
--    - INSERT/SELECT/DELETE: bucket_id = 'owner-licenses' AND name LIKE 'licenses/' || auth.uid() || '/%'

