# AGENTS.md (owner-app)

Codex 작업 규칙과 프로젝트 컨텍스트를 정의합니다. (이 저장소는 Next.js(App Router) + Tailwind + Supabase + Vercel 배포를 전제로 합니다.)

## Stack (Fixed)

- Node: 24.x (Vercel 기본 LTS에 맞춤)
- Package manager: pnpm (Corepack) / packageManager로 버전 고정
- Framework: Next.js (App Router) + TypeScript
- Styling/UI: Tailwind CSS + shadcn/ui + Radix
- Backend: Supabase (Auth + Postgres/RLS + Storage)
- Deploy: Vercel

## Local Setup

- Node: `nvm use` (repo의 `.nvmrc` 기준)
- pnpm: `corepack enable && corepack prepare pnpm@10.29.3 --activate`
- Install: `pnpm install --frozen-lockfile`
- Dev: `pnpm dev`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Build: `pnpm build`
- Start: `pnpm start`

## Architecture Rules

- Routing: `src/app` App Router 기반. 공개/보호는 Route Group으로 분리한다: `(public)`, `(protected)`.
- Auth/session: `middleware.ts` + `@supabase/ssr` 패턴으로 세션 쿠키 동기화/보호 라우트 리다이렉트.
- Data access:
  - Reads: Server Components(RSC)에서 `supabase server client`로 수행.
  - Writes/interactions: Client Components에서 `supabase browser client`로 수행하고 성공 시 `router.refresh()`.
- Secrets:
  - `SUPABASE_SERVICE_ROLE_KEY`는 절대 브라우저로 노출 금지.
  - `.env*` 파일은 커밋 금지. 새 env var 추가 시 `.env.example`에 키를 추가.

## Multi-tenant / Security

- 모든 도메인 테이블에 `shop_id`를 둔다.
- RLS는 "현재 로그인 유저가 shop_members로 연결된 shop_id만" 접근하도록 한다.
- PII/시크릿 로그 금지(토큰/키/쿠키/Authorization 헤더 포함).

## Review Guidelines (Codex/GitHub)

- Broken build/type errors: P0
- Auth/RLS 우회 가능성, shop_id 스코프 누락: P0
- a11y 회귀, 폼 validation 누락, 크리티컬 UX 깨짐: P1
- UI 변경은 모바일/데스크톱 모두 확인

## Overrides

- 특정 기능 디렉토리에 특수 규칙이 필요하면 해당 디렉토리에 `AGENTS.override.md`를 추가한다.
- Ensure auth/authorization is enforced for any sensitive page, API route, or server action.
- Treat broken builds/tests as P0; treat a11y regressions and obvious UX breakage as P1.
- For user-visible UI changes, verify both mobile and desktop layouts.

## When To Add Overrides

- If a specific subdirectory/package needs different rules, add `AGENTS.override.md` in that directory (closest file wins).

## Branch / PR Workflow

- 병합(merge) 또는 PR 생성 전에 반드시 `main` 브랜치의 최신 변경 사항을 현재 작업 브랜치에 먼저 반영한다.
- 반영 과정에서 발생한 충돌/병합 이슈는 현재 브랜치에서 해결한 뒤에만 PR을 올린다.
