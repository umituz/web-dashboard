# @umituz/web-dashboard

Installable app skeleton for SaaS dashboards: layouts, auth, onboarding,
analytics, a content calendar, an i18n bridge, and a permissions/session/
module registry. Every domain is an independent entry point — import only
what your app uses. Camp-agnostic by construction: the package ships its
own `udb-*` stylesheet driven by `--u-*` tokens, so it works identically in
vanilla-CSS and Tailwind hosts.

The package is **source-distributed** (published as raw TypeScript in `src/`).
Your bundler compiles it alongside your app; no prebuilt bundle ships.

## What changed in v4 (major)

- **Billing moved to [@umituz/web-polar-payment](https://github.com/umituz/web-polar-payment)**
  under the `./portal` entry point. The old `./billing*` entry points are gone.
- **`@umituz/web-design-system` is no longer a dependency.** The primitives
  (`Button`, `Input`, `Checkbox`, `Skeleton`, `cn`) live in `./primitives`.
- **Styling is shipped, not assumed.** Import `@umituz/web-dashboard/styles.css`
  (and optionally `tokens.css`) once; all components use `udb-*` BEM classes.
  Tailwind, design-system tokens and utility classes are gone from the package.
- **No i18n runtime.** `react-i18next` is out; hosts bridge their own `t` via
  `<DashboardI18nProvider t={i18n.t}>` (see below). Without a provider,
  keys humanize to readable English.
- **No Firebase.** The calendar persists through the injected
  `ICalendarDatabase` seam; `createInMemoryCalendarDatabase()` is the default.
- **recharts is out.** `AnalyticsChart` renders line/area/bar/pie/donut as
  dependency-free SVG with native `<title>` tooltips.
- **New fleet modules**: `./permissions`, `./session`, `./modules` — the
  texora/visora pattern (one module list drives routes + nav + guards) as
  reusable building blocks.

## Installation

```bash
npm install @umituz/web-dashboard
import "@umituz/web-dashboard/styles.css";
```

Peers: `react` + `react-dom` (^18 or ^19) and `react-router-dom` (^6 or ^7).
Runtime deps: `clsx` + `lucide-react`. Nothing else.

### Tailwind hosts

Every `udb-*` rule sets its own `box-sizing`/`background`/`border` explicitly,
so preflight cannot leak in — but load order still matters with `*`-selector
resets: import the package stylesheet **after** your base layer.

### Theming & dark mode

Override the `--u-*` custom properties (see `tokens.css` for the full list).
Dark mode is host-driven: put `data-udb-theme="dark"` on any ancestor.

## Entry points

```bash
@umituz/web-dashboard/styles.css    # component stylesheet (udb-* BEM)
@umituz/web-dashboard/tokens.css    # --u-* custom properties only
@umituz/web-dashboard/primitives    # Button, Input, Checkbox, Skeleton, cn
@umituz/web-dashboard/i18n          # DashboardI18nProvider, useT, defaultT
@umituz/web-dashboard/permissions   # PermissionMatrix, hasPermission, guards
@umituz/web-dashboard/session       # AuthAdapter, SessionProvider, OrgSwitcher, DemoLogin
@umituz/web-dashboard/modules       # DashboardModule, buildRoutes, buildNav
@umituz/web-dashboard/layouts       # DashboardLayout, DashboardSidebar, DashboardHeader
@umituz/web-dashboard/settings      # SettingsLayout, admin skeletons (users, matrix, audit)
@umituz/web-dashboard/onboarding    # OnboardingWizard + steps, useOnboarding
@umituz/web-dashboard/auth          # Login/Register/Forgot/Reset forms, AuthLayout
@umituz/web-dashboard/analytics     # AnalyticsLayout, SVG AnalyticsChart, services
@umituz/web-dashboard/calendar      # useCalendar, CalendarService (injected DB)
@umituz/web-dashboard/config        # dashboard config helpers
```

Each domain also exposes `components`, `hooks`, `utils`, `types`
sub-entries (and `services` for analytics/calendar). The new v4 modules
(`permissions`, `session`, `modules`) are **deep-entry only** — they are not
re-exported from the root, so router-less hosts never pull router code in
transitively.

## The v4 composition

A host app assembles the skeleton from four seams:

```tsx
import { DashboardI18nProvider } from "@umituz/web-dashboard/i18n";
import { SessionProvider, createInMemoryAuthAdapter } from "@umituz/web-dashboard/session";
import { PermissionsProvider } from "@umituz/web-dashboard/permissions";

const adapter = createInMemoryAuthAdapter({ users: DEMO_USERS });

<DashboardI18nProvider t={i18n.t}>
  <SessionProvider adapter={adapter}>
    <PermissionsProvider matrix={ROLE_PERMISSIONS} role={user?.role}>
      <App />
    </PermissionsProvider>
  </SessionProvider>
</DashboardI18nProvider>
```

### One module list → routes + nav + guards

```tsx
import { buildRoutes, buildNav } from "@umituz/web-dashboard/modules";
import { usePermissions } from "@umituz/web-dashboard/permissions";

const MODULES: DashboardModule[] = [
  { path: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard,
    navGroup: "nav.overview", order: 1, permission: "dashboard.view",
    element: <DashboardPage /> },
  { path: "/sales/:id", labelKey: "nav.salesDetail", icon: Circle,
    navGroup: "nav.commercial", inNav: false, permission: "sales.view",
    element: <SalesDetailPage /> },
];

// routes: element pre-wrapped in <RequirePermission>
const routes = buildRoutes(MODULES);            // -> <Route path key={...} {...route} />

// nav: permission-filtered, grouped, ordered -> feed DashboardLayout config
const { can } = usePermissions();
const sidebarGroups = buildNav(MODULES, { can });
```

Groups keep their first-appearance order in the list; `order` sorts items
within a group; `inNav: false` hides detail routes from the sidebar.

### Permissions

`hasPermission(matrix, role, permission)` is pure and deny-by-default.
Matrix grants are `"*"` (everything), `"sales.*"` (module wildcard) or exact
strings. `<RequirePermission permission>` guards pages (lock screen
fallback); `<Can>` is its inline twin.

### Session

Hosts adapt their auth to `AuthAdapter` (`login`/`logout`/`current`;
`listTenants`/`demoLogin` optional). `useSession()` exposes user, tenants,
active tenant, status + `switchTenant`. `OrgSwitcher` renders the tenant
dropdown; `DemoLogin` the one-click demo entry.

### Calendar

```tsx
import { CalendarService, createInMemoryCalendarDatabase } from "@umituz/web-dashboard/calendar/services";

// Bring your own backend:
class MyDatabase implements ICalendarDatabase { /* ... */ }
const service = new CalendarService(new MyDatabase());
// or demo/test:
const demo = new CalendarService(createInMemoryCalendarDatabase());
```

### Analytics

`AnalyticsChart` consumes the same `ChartConfig` as v3 for
line/area/bar/pie/donut. Tooltips are native SVG `<title>` elements;
legends are color chips; unsupported types render an empty state.
`useAnalytics` stays dependency-injected (`createStubAnalyticsApiClient`).

## i18n contract

Components render **i18n keys**, never English strings. Bridge your runtime
once:

```tsx
import { DashboardI18nProvider } from "@umituz/web-dashboard/i18n";

<DashboardI18nProvider t={i18n.t}>  {/* i18next's t — signature already matches */}
```

Interpolation uses the standard `{{placeholder}}` syntax. Without a
provider, `useT()` falls back to `defaultT`, which humanizes keys
(`auth.login.welcomeBack` → "Welcome back") so a bare install still renders
readably. The per-domain key catalogs are the string contract:

```ts
import { AUTH_KEYS } from "@umituz/web-dashboard/auth";
import { ANALYTICS_KEYS } from "@umituz/web-dashboard/analytics";
import { ONBOARDING_KEYS } from "@umituz/web-dashboard/onboarding";
import { SETTINGS_ADMIN_KEYS } from "@umituz/web-dashboard/settings/utils/i18nKeys";
import { PERMISSIONS_KEYS } from "@umituz/web-dashboard/permissions";
import { SESSION_KEYS } from "@umituz/web-dashboard/session";
```

## Platform compatibility

- React 18 and 19, react-router-dom 6 and 7
- `generateResetToken` requires `crypto.getRandomValues` (all modern browsers,
  Node ≥ 19) and **throws** rather than falling back to an insecure PRNG
- Rendering targets the DOM; React Native is not supported

## Development

```bash
npm install
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm test            # vitest unit tests (pure utils + module builders)
npm run test:watch
```

CI runs lint + typecheck + test on every push/PR to `main`.

## Migration: 3.x → 4.0

1. Billing UI: switch imports to `@umituz/web-polar-payment/portal`.
2. Design-system imports: use `@umituz/web-dashboard/primitives`
   (`Button`/`Input`/`Checkbox`/`Skeleton` cover the used surface).
3. Styling: import `styles.css` once; Tailwind utility classes no longer
   exist inside the package. Config values that used to carry Tailwind
   strings changed: `PlatformOption.color` is a plain CSS color string,
   `PlanOption.badgeColor` became `badgeTone: "muted" | "primary" | "accent"`.
4. i18n: wrap your app in `DashboardI18nProvider t={i18n.t}`; the
   `react-i18next` peer is gone.
5. Calendar: pass your own `ICalendarDatabase` (or the in-memory default);
   the Firebase implementation was removed.
6. v3.2.5 behavioral notes still apply (opt-in mock auth, route skeletons
   off by default, `PerformanceService.startMonitoring()` explicit).

## License

MIT
