---
name: owner-ui-screen-builder
description: Build or revise frontend screens in this owner-app repository using the established Next.js App Router + Tailwind + shadcn patterns. Use when requests involve new pages, screen redesign, layout composition, component extraction, responsive fixes, accessibility improvements, or UI state/interaction polishing under src/app, src/features, and src/components. Follow project constraints for route groups, Supabase client boundaries, and mobile/desktop compatibility. Do not use for backend-only tasks, schema migrations, or RLS policy authoring unless directly required to complete a UI change.
---

# Owner UI Screen Builder

Implement UI work in this repository with predictable structure, reusable components, and safe data boundaries.

## 1. Place code in the right layer

- Map the request to an App Router destination first.
- Keep route groups consistent:
  - Public screens in `src/app/(public)`.
  - Authenticated screens in `src/app/(protected)`.
- Keep route `page.tsx` files thin and move screen composition to feature modules.
- Prefer this feature split:
  - `src/features/<feature>/screens/*` for screen assembly.
  - `src/features/<feature>/ui/*` for presentational blocks.
  - `src/features/<feature>/view-model/*` for client-side orchestration.
  - `src/features/<feature>/model/*` for types and mapping.

## 2. Reuse existing UI primitives before creating new ones

- Prefer existing components in:
  - `src/components/ui/*`
  - `src/components/auth/*`
  - `src/components/common/*`
  - `src/components/shell/*`
- Reuse `cn` from `src/lib/utils.ts` for class composition.
- Keep styling in Tailwind utility classes and existing visual language.
- Add a new shared component only when repetition appears across at least two screens.

## 3. Respect data-access boundaries during UI implementation

- For reads in server-rendered flows, use the server Supabase client in server components.
- For writes/interactions, use browser Supabase client in client components and refresh with `router.refresh()` after success.
- Never expose server-only secrets in client code.
- When backend integration is not part of the task, keep mock/model data typed and isolated in feature model files.

## 4. Build responsive and accessible by default

- Start from mobile layout, then extend to tablet/desktop.
- Validate both narrow and wide layouts whenever changing major containers.
- Ensure all interactive controls have accessible names.
- Preserve visible focus styles for keyboard users.
- Keep color contrast and disabled/error states explicit.
- For forms, include validation/error messaging and prevent silent failures.

## 5. Implement complete UI states

- Include meaningful empty/loading/error/success states where relevant.
- Avoid shipping a screen that only supports the happy path.
- Ensure scroll behavior is intentional (no accidental double-scroll containers).
- Keep action affordances clear for primary and secondary actions.

## 6. Verify before handoff

Run these checks after UI edits:

```bash
pnpm lint
pnpm typecheck
```

Run `pnpm build` when route structure, shared UI primitives, or typing changes are broad.

If a command cannot be run, report exactly what was skipped and why.

## 7. Handoff format

When finishing a task with this skill:

- Summarize changed files grouped by purpose.
- Call out responsive and accessibility checks performed.
- Mention unresolved assumptions or risks explicitly.
- Suggest next steps only when they are actionable for this repository.

## Repo references

Use these references when the request touches architecture constraints:

- `AGENTS.md`
- `docs/architecture.md`
- `src/app/(public)`
- `src/app/(protected)`
