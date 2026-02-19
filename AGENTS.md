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

## Supabase Workflow

- DB는 개발/통합 단계에서 `shared-staging` 단일 프로젝트를 공용으로 사용한다.
- 이 저장소는 `shared-staging` 대상으로 직접 `db push`를 허용한다.
- `shared-schema` 저장소 CI도 동일한 `shared-staging/prod`를 사용한다.
- `shared-prod` 환경은 유지한다. 해커톤/초기 단계에서는 승인자(`Required reviewers`)를 비워둘 수 있고, 운영 전환 시 1명 이상 권장한다.
- 공용 마이그레이션 canonical은 submodule `shared-schema/migrations`다.
- 서브모듈 초기화/업데이트: `git submodule update --init --recursive`
- 실행 대상 경로는 `supabase/migrations`이며, `pnpm db:sync:from-shared`로 동기화한다.
- 동기화 기준 브랜치 고정 체크: `pnpm db:shared:branch:check` (`shared-schema` HEAD가 `origin/main` 계열인지 검증)
- 환경 변수 계약:
  - `SUPABASE_DB_URL_SHARED_STAGING`
  - `SUPABASE_DB_URL_SHARED_PROD`
- migration 작업 기본 검증 순서:
  - `pnpm db:check` (`migration list` + `db push --dry-run` + `db diff`)
  - `pnpm db:check`는 머신 단위 락(`/tmp/todays-nail-shared-db-check.lock`)으로 동시 실행을 차단해 레포 단위 순차 실행을 강제한다.
  - `pnpm db:push:shared` (shared-staging으로 push)
  - 공용 스키마 관련 파일(예: `supabase/migrations`, `shared-schema` 변경) 작업 시 `pnpm db:check`를 PR/변경 건의 게이트로 항상 통과해야 한다.
- `--linked` 인증이 불안정하면 스크립트가 `SUPABASE_DB_URL_SHARED_STAGING`로 자동 fallback한다.
- Docker가 실행 중이 아니면 `db:check`에서 `db diff`는 자동 스킵한다.
- 새 migration 파일(전환 시점 이후)은 `YYYYMMDDHHMMSS_<team>_<description>.sql` 형식을 지킨다. (`team`: `ios` 또는 `web`)

## Notion Alignment (Required)

- DB/API/요구사항 변경 전 Notion 기준 문서(`🧩 기능 명세`, `🙏 요구사항 명세서`, `🚀 MVP`, `📑 시나리오`, `🗒️ 기능 구현`)를 확인한다.
- 구현 코드와 문서 변경은 같은 사이클에서 동시 반영해 불일치를 남기지 않는다.
- PR에는 참조한 Notion 링크와 정합성 점검 결과를 반드시 기재한다.

## Architecture Rules

- Routing: `src/app` App Router 기반. 공개/보호는 Route Group으로 분리한다: `(public)`, `(protected)`.
- Auth/session: `middleware.ts` + `@supabase/ssr` 패턴으로 세션 쿠키 동기화/보호 라우트 리다이렉트.
- Data access:
  - Reads: Server Components(RSC)에서 `supabase server client`로 수행.
  - Writes/interactions: Client Components에서 `supabase browser client`로 수행하고 성공 시 `router.refresh()`.
- Secrets:
  - `SUPABASE_SERVICE_ROLE_KEY`는 절대 브라우저로 노출 금지.
  - `.env*` 파일은 커밋 금지. 새 env var 추가 시 `.env.example`에 키를 추가.
- 자세한 구조: `docs/architecture.md`

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

## Branch / PR Workflow

- 병합(merge) 또는 PR 생성 전에 반드시 `main` 브랜치의 최신 변경 사항을 현재 작업 브랜치에 먼저 반영한다.
- 반영 과정에서 발생한 충돌/병합 이슈는 현재 브랜치에서 해결한 뒤에만 PR을 올린다.

## Git Commit Convention

효율적인 이력 관리와 협업을 위해 커밋 규칙을 준수한다.

- **Commit Message Format**: `type(scope): message` 패턴을 사용한다. (예: `feat(bookings): 예약 칸반 UI 구현`, `refactor(shell): 사이드바 분리`)
- **Functional Units**: 변경 사항이 클 경우, 하나의 커밋에 몰아넣지 않고 논리적으로 연관된 기능 단위(Functional Unit)로 나누어 커밋한다.
  - 예: 의존성 추가(chore), 로직 리팩토링(refactor), 신규 UI 구현(feat)은 되도록 분리한다.
- **Commit Planning**: 에이전트는 복잡한 다수 파일 변경 시, 커밋을 수행하기 전 사용자에게 기능 단위 커밋 계획을 먼저 제안하고 승인 후 실행한다.
