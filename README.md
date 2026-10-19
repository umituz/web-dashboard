# @umituz/web-dashboard

Installable app skeleton for SaaS dashboards: layouts, auth, analytics, a
content calendar, and a permissions/session/module registry. Every domain is
an independent entry point — import only what your app uses. UI atoms and
design tokens come from [@umituz/web-design-system](https://github.com/umituz/web-design-system);
translations from [@umituz/web-localization](https://github.com/umituz/web-localization).

The package is **source-distributed** (published as raw TypeScript in `src/`).
Your bundler compiles it alongside your app; no prebuilt bundle ships.

## What changed in v5 (major)

- **No more local primitives.** The `./primitives` entry point is gone;
  components import `@umituz/web-design-system` directly. Hosts that need
  `Button`/`Input`/`Checkbox`/`Skeleton`/`cn` import them from the design
  system.
- **No more `--u-*` token layer.** `tokens.css` is deleted. The `udb-*`
  stylesheet consumes the design-system variables (`--color-*`, `--radius-*`,
  `--font-*`, `--shadow-*`) directly; dashboard-specific knobs (typography
  scale, sidebar geometry) are `--udb-*` custom properties defined in
  `styles.css` itself.
- **No more local i18n copy.** The `./i18n` entry point is gone; `useT` now
  comes from `@umituz/web-localization/react` (`I18nProvider` there replaces
  `DashboardI18nProvider`, same `t` signature).
- **No bundled dark preset.** Dark mode follows the design system: hosts set
  dark values on the DS variables under `[data-theme="dark"]` / `.dark`
  (see the design system's `bridge.css` contract).

## Installation

```bash
npm install @umituz/web-dashboard
import "@umituz/web-dashboard/styles.css";
```

Peers: `react` + `react-dom` (^18 or ^19) and `react-router-dom` (^6 or ^7).
Runtime deps: `@umituz/web-design-system`, `@umituz/web-localization`,
`lucide-react`. Nothing else.

### Tailwind hosts

Every `udb-*` rule sets its own `box-sizing`/`background`/`border` explicitly,
so preflight cannot leak in — but load order still matters with `*`-selector
resets: import the package stylesheet **after** your base layer.

### Theming & dark mode

`styles.css` imports `@umituz/web-design-system/styles.css` transitively and
reads its variables, so theming has exactly one path: set the DS variables.
Vanilla-CSS hosts define `--app-*` slots via the design system's `bridge.css`;
Tailwind hosts override `--color-*` from their own `@theme`. Dashboard-only
knobs (`--udb-font-size-*`, `--udb-space-*`, `--udb-sidebar-*`,
`--udb-header-height`, `--udb-border-strong`, `--udb-radius-pill`) can be overridden anywhere in the cascade.

## Entry points

```bash
@umituz/web-dashboard/styles.css    # component stylesheet (udb-* BEM)
@umituz/web-dashboard/permissions   # PermissionMatrix, hasPermission, guards
@umituz/web-dashboard/session       # AuthAdapter, SessionProvider, OrgSwitcher, DemoLogin
@umituz/web-dashboard/modules       # DashboardModule, buildRoutes, buildNav
@umituz/web-dashboard/layouts       # DashboardLayout, DashboardSidebar, DashboardHeader
@umituz/web-dashboard/settings      # SettingsLayout, admin skeletons (users, matrix, audit)
@umituz/web-dashboard/auth          # Login/Register/Forgot/Reset forms, AuthLayout
@umituz/web-dashboard/analytics     # AnalyticsLayout, SVG AnalyticsChart, services
@umituz/web-dashboard/calendar      # useCalendar, CalendarService (injected DB)
@umituz/web-dashboard/config        # dashboard config helpers
@umituz/web-dashboard/charts        # dependency-free SVG chart components
```

Each domain also exposes `components`, `hooks`, `utils`, `types`
sub-entries (and `services` for analytics/calendar). The v4 modules
(`permissions`, `session`, `modules`) are **deep-entry only** — they are not
re-exported from the root, so router-less hosts never pull router code in
transitively.

## The composition

A host app assembles the skeleton from four seams:

```tsx
import { I18nProvider } from "@umituz/web-localization/react";
import { SessionProvider, createInMemoryAuthAdapter } from "@umituz/web-dashboard/session";
import { PermissionsProvider } from "@umituz/web-dashboard/permissions";

const adapter = createInMemoryAuthAdapter({ users: DEMO_USERS });

<I18nProvider t={i18n.t}>
  <SessionProvider adapter={adapter}>
    <PermissionsProvider matrix={ROLE_PERMISSIONS} role={user?.role}>
      <App />
    </PermissionsProvider>
  </SessionProvider>
</I18nProvider>
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

`AnalyticsChart` consumes `ChartConfig` for line/area/bar/pie/donut. Tooltips
are native SVG `<title>` elements; legends are color chips; unsupported types
render an empty state. `useAnalytics` stays dependency-injected
(`createStubAnalyticsApiClient`).

## i18n contract

Components render **i18n keys**, never English strings. Bridge your runtime
once with `@umituz/web-localization/react`:

```tsx
import { I18nProvider } from "@umituz/web-localization/react";

<I18nProvider t={i18n.t}>  {/* i18next's t — signature already matches */}
```

Interpolation uses the standard `{{placeholder}}` syntax. Without a
provider, `useT()` falls back to `defaultT`, which humanizes keys
(`auth.login.welcomeBack` → "Welcome back") so a bare install still renders
readably. The per-domain key catalogs are the string contract:

```ts
import { AUTH_KEYS } from "@umituz/web-dashboard/auth";
import { ANALYTICS_KEYS } from "@umituz/web-dashboard/analytics";
import { SETTINGS_ADMIN_KEYS } from "@umituz/web-dashboard/settings/utils";
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

## Migration: 4.x → 5.0

1. `@umituz/web-dashboard/primitives` → import `Button`/`Input`/`Checkbox`/
   `Skeleton` from `@umituz/web-design-system/atoms` and `cn` from
   `@umituz/web-design-system/utils/cn`.
2. `@umituz/web-dashboard/i18n` → `DashboardI18nProvider` becomes
   `I18nProvider` from `@umituz/web-localization/react`; `useT`, `defaultT`
   and `TranslateFn` come from the same entry point.
3. `@umituz/web-dashboard/tokens.css` → drop the import; `styles.css` is the
   only stylesheet. Migrate `--u-*` overrides to the DS variables
   (`--u-color-primary` → `--color-primary`, `--u-color-surface` →
   `--color-card`, `--u-color-bg` → `--color-background`, `--u-color-text` →
   `--color-foreground`, `--u-color-muted` → `--color-muted-foreground`,
   `--u-color-surface-muted` → `--color-muted`, `--u-color-danger` →
   `--color-destructive`) and dashboard knobs to their `--udb-*` names
   (`--u-font-size-*` → `--udb-font-size-*`, `--u-color-border-strong` →
   `--udb-border-strong`, `--u-sidebar-*` → `--udb-sidebar-*`, `--u-space-*` →
   `--udb-space-*`).
4. Dark mode: replace `data-udb-theme="dark"` with the design-system
   convention (`[data-theme="dark"]` / `.dark` + dark DS variable values).

## License

MIT
