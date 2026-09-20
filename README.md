# @umituz/web-dashboard

Shared, domain-oriented React building blocks for SaaS dashboards: layouts, settings,
onboarding, auth, analytics, billing, and a content calendar. Each domain is an
independent entry point — import only what your app uses; the rest never enters
your bundle.

The package is **source-distributed** (published as raw TypeScript in `src/`).
Your bundler compiles it alongside your app; no prebuilt bundle ships.

## Installation

```bash
npm install @umituz/web-dashboard
```

### Peer dependencies

Only the packages backing the entry points you import must be installed.

| Package | Required by | Required? |
| --- | --- | --- |
| `react`, `react-dom` (^18 or ^19) | everything | yes |
| `react-router-dom` (^6 or ^7) | layouts, onboarding, auth | yes |
| `react-i18next` (^13 – ^16) | every UI component (see i18n below) | yes |
| `@umituz/web-design-system` ^3.1.11 | every UI component | yes |
| `firebase` ^10 – ^12, `@umituz/web-firebase` ^3 | `calendar` services only | optional |

A SaaS that uses only localization-flavored components (e.g. onboarding) needs
neither Firebase package. Firebase-backed calendar services load Firebase via
dynamic `import()` at runtime.

Runtime dependencies kept intentionally tiny: `clsx`, `tailwind-merge`,
`class-variance-authority`, `lucide-react`, `recharts` (charts only).

## Entry points

Each domain exposes a root, plus `components`, `hooks`, `utils`, `types`
sub-entries (and `services` for analytics/calendar):

```bash
@umituz/web-dashboard/layouts        # DashboardLayout, DashboardSidebar, DashboardHeader, theme
@umituz/web-dashboard/settings       # SettingsLayout, SettingsSection
@umituz/web-dashboard/onboarding     # OnboardingWizard + step components, useOnboarding
@umituz/web-dashboard/auth           # Login/Register/Forgot/Reset forms, AuthLayout
@umituz/web-dashboard/analytics      # AnalyticsLayout, useAnalytics, AnalyticsEngineService
@umituz/web-dashboard/billing        # BillingPortal, PlanComparison, useBilling
@umituz/web-dashboard/calendar       # useCalendar, CalendarService (Firebase-backed)
@umituz/web-dashboard/config         # dashboard config helpers
```

## Usage

### Layouts

```tsx
import { DashboardLayout } from "@umituz/web-dashboard/layouts";

<DashboardLayout
  config={{ sidebarGroups, brandName: "Acme" }}
  user={user}
  isAuthenticated={!!user}
  theme={theme}
  onToggleTheme={toggleTheme}
/>
```

Notes:

- The theme toggle in the header is rendered **only** when `onToggleTheme` is
  provided — wire it to your own theme state.
- Route-change skeletons are **off by default** (`routeTransitionMs = 0`).
  Pass `routeTransitionMs={300}` to re-enable the previous behavior.

### Analytics / Billing hooks (dependency-injected)

Both hooks accept an API client so no network layer is hard-wired. Use the
provided stub during development:

```tsx
import { useAnalytics, createStubAnalyticsApiClient } from "@umituz/web-dashboard/analytics";

const analytics = useAnalytics({ apiClient: createStubAnalyticsApiClient() });
```

`useBilling` works the same way with `createStubBillingApiClient`.

### Auth forms

```tsx
import { LoginForm } from "@umituz/web-dashboard/auth/components";

<LoginForm onLoginAttempt={({ email, password }) => signIn(email, password)} />
```

> **Behavior change (v3.2.5):** `LoginForm` no longer performs a mock
> successful login when no `onLoginAttempt` is provided. Pass
> `enableMockAuth` explicitly to restore the demo behavior.

### Calendar (optional Firebase)

```tsx
import { useCalendar } from "@umituz/web-dashboard/calendar/hooks";
```

## i18n contract

Components are copy-free: they render **i18n keys**, never English strings.
The package exports the full key catalog per domain —

```ts
import { AUTH_KEYS } from "@umituz/web-dashboard/auth";
import { BILLING_KEYS } from "@umituz/web-dashboard/billing";
import { ANALYTICS_KEYS } from "@umituz/web-dashboard/analytics";
import { ONBOARDING_KEYS } from "@umituz/web-dashboard/onboarding";
```

— and your app supplies translations via react-i18next. Interpolation uses the
standard i18next `{{placeholder}}` syntax (e.g. `billing.planComparison.save`
receives `{{percent}}`; `onboarding.plan.description` receives `{{days}}`).
When a key has no translation, react-i18next renders the key itself — treat
that as a missing-catalog bug in your app, not a fallback message.

## Platform compatibility

- React 18 and 19, react-router-dom 6 and 7, react-i18next 13–16
- `generateResetToken` requires `crypto.getRandomValues` (all modern browsers,
  Node ≥ 19) and **throws** rather than falling back to an insecure PRNG
- Rendering targets the DOM; React Native is not supported by the layout/
  chart components

## Development

```bash
npm install
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm test            # vitest unit tests (pure utils)
npm run test:watch
```

CI runs lint + typecheck + test on every push/PR to `main`.

## Migration: 3.2.4 → 3.2.5

Additive changes only, with three behavioral notes:

1. **`LoginForm` mock auth is opt-in.** Without `onLoginAttempt`, submitting
   now throws a `noAuthProvider` error instead of faking a login.
2. **Route-change skeletons default to off** in `DashboardLayout` /
   `SettingsLayout`. Set `routeTransitionMs` to keep the old flash.
3. **`PerformanceService` no longer auto-starts observers** on import. Call
   `performanceService.startMonitoring()` explicitly (the singleton export is
   unchanged for compatibility).

New opt-in props: `locale` (billing portal/cards), `theme`/`onToggleTheme`
(header), `showCreatePost` (sidebar), `translate` (AuthLayout),
`enableMockAuth` (LoginForm), `stateField` (onboarding `AppTypeOption`).

## License

MIT
