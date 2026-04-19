# Testing Report

## Summary

This report covers the test infrastructure and test suites added for the current Next.js 16 frontend.

Implemented scope:

- Baseline fix for the broken `PaginatedResult` usage in `src/app/dashboard/customer/orders/page.tsx`
- Expanded `Vitest` unit/component coverage
- Added shared test utilities for `QueryClient` and `next/navigation` mocking
- Added hybrid `Playwright` E2E coverage:
  - stable mock-based suite
  - live smoke suite against the real local backend
- Added script entrypoints for running unit, coverage, E2E, and full-chain verification

## Initial Baseline

Initial state before implementation:

- `npm run test -- --run`: passed with 3 files / 22 tests
- `npm run build`: failed

Initial blocking issue:

- `src/app/dashboard/customer/orders/page.tsx` used `data?.items` even though `PaginatedResult<T>` is shaped as `{ data, totalItems }`
- This prevented `next build` from completing and also blocked production-mode E2E

## Changes Added

### Test infrastructure

- Added scripts in `package.json`:
  - `test:unit`
  - `test:coverage`
  - `test:e2e:mock`
  - `test:e2e:live`
  - `test:all`
- Updated `vitest.config.ts` to:
  - explicitly include repo test files only
  - exclude `tests/e2e/**`
- Extended `vitest.setup.ts` with:
  - `next/navigation` mock wiring
  - `next/image` mock for component rendering
- Added shared helpers:
  - `src/test/next-navigation.ts`
  - `src/test/render.tsx`
- Added reusable fixtures:
  - `tests/fixtures/api.ts`
- Added Playwright config:
  - `playwright.config.ts`
  - dedicated production-mode server on port `3100`
  - HTML report output to `playwright-report`
  - artifacts to `test-results/playwright`

### Unit/component coverage

Added or expanded tests for:

- `src/lib/api/env.ts`
- `src/lib/api/http-client.ts`
- `src/lib/query-client.ts`
- `src/features/auth/application/services/auth.utils.ts`
- `src/features/auth/presentation/components/LoginForm.tsx`
- `src/features/auth/presentation/components/ForgotPasswordForm.tsx`
- `src/features/auth/presentation/components/GoogleCallbackHandler.tsx`
- `src/features/orders/application/use-cases/order.use-cases.ts`
- `src/features/orders/presentation/components/OrderForm.tsx`
- `src/features/orders/presentation/hooks/useCheckout.ts`
- `src/features/orders/presentation/screens/CheckoutScreen.tsx`
- `src/features/tracking/application/mappers/tracking-view-model.mapper.ts`
- `src/features/tracking/presentation/screens/TrackingLookupScreen.tsx`
- `src/features/tracking/presentation/screens/TrackingDetailScreen.tsx`
- `src/features/admin/application/use-cases/dashboard.use-case.ts`
- `src/features/admin/presentation/screens/DispatcherDashboardScreen.tsx`
- `src/features/analytics/presentation/screens/AnalyticsDashboardScreen.tsx`
- `src/features/warehouses/application/use-cases/warehouse.use-cases.ts`
- `src/app/dashboard/customer/orders/page.tsx`

### E2E coverage

Mock suite:

- `tests/e2e/mock/public-auth.spec.ts`
- `tests/e2e/mock/operations-dashboard.spec.ts`
- `tests/e2e/mock/mock-api.ts`

Live suite:

- `tests/e2e/live/public-smoke.spec.ts`

## Commands Run

Executed successfully:

```bash
npm run build
npm run test:unit
npx playwright install chromium
npm run test:e2e:mock
npm run test:e2e:live
npm run test:coverage
npm run test:all
```

## Final Results

### Build

- `npm run build`: passed

### Unit/component

- `22` test files passed
- `68` tests passed

### E2E mock

- `6` tests passed

Covered flows:

- landing + navigation smoke
- login redirect flow
- register + OTP flow
- forgot-password + OTP flow
- public tracking success/not-found
- order creation -> checkout -> COD confirm -> tracking
- admin analytics/customer dashboard rendering with mocked backend data

### E2E live

- `2` tests passed
- `1` test skipped

Passed live checks:

- backend health endpoint reachable at local backend base URL
- landing page renders against the real app
- tracking lookup page renders against the real app

Skipped live check:

- tracking detail smoke test is skipped when `E2E_TRACKING_CODE` is not provided

## Coverage

Coverage generated with `vitest --coverage`.

Summary:

- Statements: `75.39%`
- Branches: `64.20%`
- Functions: `66.66%`
- Lines: `75.85%`

High-signal coverage areas:

- auth component flows
- tracking screens and mapping
- checkout hook logic
- HTTP client refresh handling
- dashboard state rendering

Lower-coverage areas still remaining:

- `token-storage.ts`
- chart/admin primitive rendering branches
- some checkout UI branches
- utility formatters
- service-tier catalog internals

## Issues Found During Implementation

- Baseline type mismatch on customer orders page blocked production build.
- Playwright initially reused an already-running local dev server on `:3000`; config was changed to force a dedicated production-mode server on `:3100`.
- Protected-route proxy depends on auth cookie, not only client localStorage; mock E2E auth seeding was updated to add the required cookie.
- Several E2E assertions needed to be aligned with the actual rendered accessibility tree instead of assuming unique raw text matches.

## Artifacts

- Playwright HTML report: `playwright-report/`
- Playwright traces/screenshots/videos: `test-results/playwright/`
- Vitest coverage output: `coverage/`

## Remaining Gaps / Next Recommendations

- Provide a valid `E2E_TRACKING_CODE` to enable real live tracking-detail verification.
- If protected live E2E is needed, add dedicated seeded credentials and permission-ready backend data.
- Add another live suite for authenticated admin/customer flows once stable test accounts are available.
- Raise coverage on storage/utilities and remaining admin/analytics branches if a stricter CI gate is planned later.
