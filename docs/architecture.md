# Owner Web Architecture (MVP)

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (Radix 기반)
- Supabase: Auth + Postgres (RLS) + Storage
- Deploy: Vercel
- Node: 24.x, Package manager: pnpm

## Routing

- Public routes: `/login`, `/signup`
- Protected routes: 그 외 전부(기본은 `/`부터 보호)
- Route Groups:
  - `src/app/(public)`
  - `src/app/(protected)`

## Auth / Session

- `middleware.ts`에서 `@supabase/ssr`로 세션 쿠키를 동기화하고, 보호 라우트를 강제한다.
- 서버 컴포넌트에서는 server client로 `auth.getUser()` 등을 호출해 보호/리다이렉트가 가능하도록 한다.

## Data Access Pattern

- Reads: Server Components(RSC)에서 server client로 수행
- Writes/interactions: Client Components에서 browser client로 수행하고, 성공 시 `router.refresh()`

## Multi-tenant (shop_id) & RLS

- 모든 도메인 테이블에 `shop_id`
- 멤버십 테이블: `shop_members(user_id, shop_id, role)`
- RLS 기본 정책: 현재 로그인 유저가 `shop_members`로 연결된 `shop_id` 범위만 접근 허용

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (옵션) `NEXT_PUBLIC_SITE_URL`
- (옵션) `NEXT_PUBLIC_MARKETING_URL` (외부 마케팅 페이지 링크)
- (옵션) `NEXT_PUBLIC_CUSTOMER_APP_URL` (고객 예약 앱 URL)
- (옵션) `NEXT_PUBLIC_AI_FITTING_DEMO_URL` (AI 손 피팅/커스텀 데모 영상 URL)
- (옵션) `NEXT_PUBLIC_PLAYSTORE_URL` (Google Play 이동 URL)
- (옵션) `NEXT_PUBLIC_APPSTORE_URL` (App Store 이동 URL)
- (서버 전용) `SUPABASE_SERVICE_ROLE_KEY` (브라우저 노출 금지)

## Future

- OpenAI 호출/결제 웹훅 등 비밀키가 필요한 작업은 Supabase Edge Functions로 분리한다.
