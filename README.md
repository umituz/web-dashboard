# @umituz/web-dashboard

Installable app skeleton for SaaS dashboards: layouts, analytics, a content
calendar, a product onboarding flow, a permissions/module registry, an
organization/membership module, and a notifications module. Every
domain is an independent entry point — import only what your app uses. UI
atoms and design tokens come from [@umituz/web-design-system](https://github.com/umituz/web-design-system);
translations from [@umituz/web-localization](https://github.com/umituz/web-localization).

The package is **source-distributed** (published as raw TypeScript in `src/`).
Your bundler compiles it alongside your app; no prebuilt bundle ships.

## Installation

```bash
npm install @umituz/web-dashboard
import "@umituz/web-dashboard/styles.css";
```

Peers: `react` + `react-dom` (^18 or ^19), `react-router-dom` (^6 or ^7),
and `framer-motion` (^12, onboarding animations only).
Runtime deps: `@umituz/web-design-system` (^4.9),
`@umituz/web-localization`, `lucide-react`.

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
`--udb-header-height`, `--udb-border-strong`, `--udb-radius-pill`) can be
overridden anywhere in the cascade. Dark mode follows the design system:
hosts set dark values on the DS variables under `[data-theme="dark"]` /
`.dark`.

## Entry points

```bash
@umituz/web-dashboard/styles.css    # component stylesheet (udb-* BEM, incl. udb-onb-*)
@umituz/web-dashboard/permissions   # PermissionMatrix, hasPermission, guards
@umituz/web-dashboard/organization  # OrganizationProvider, members + invitations, seats, switcher
@umituz/web-dashboard/notifications # NotificationsProvider, bell + center, page skeleton
@umituz/web-dashboard/modules       # DashboardModule, buildRoutes, buildNav
@umituz/web-dashboard/layouts       # DashboardLayout, DashboardSidebar, DashboardHeader
@umituz/web-dashboard/settings      # SettingsLayout, admin skeletons (users, matrix, audit)
@umituz/web-dashboard/onboarding    # OnboardingFlow + 15 screens, persistence, analytics
@umituz/web-dashboard/analytics     # AnalyticsLayout, SVG AnalyticsChart, services
@umituz/web-dashboard/calendar      # useCalendar, CalendarService (injected DB)
@umituz/web-dashboard/config        # dashboard config helpers
@umituz/web-dashboard/charts        # dependency-free SVG chart components
```

Each domain also exposes `components`, `hooks`, `utils`, `types`
sub-entries (and `services` for analytics/calendar). The modules
(`permissions`, `modules`, `onboarding`) are **deep-entry only** — they are
not re-exported from the root, so router-less hosts never pull router code
in transitively.

## The composition

A host app assembles the skeleton from its seams:

```tsx
import { I18nProvider } from "@umituz/web-localization/react";
import { PermissionsProvider } from "@umituz/web-dashboard/permissions";

<I18nProvider t={i18n.t}>
  <PermissionsProvider matrix={ROLE_PERMISSIONS} role={user?.role}>
    <App />
  </PermissionsProvider>
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

### Onboarding

`OnboardingFlow` runs a declarative screen list (`welcome`, `goal-question`,
`pain-points`, `social-proof`, `tinder-cards`, `personalized-solution`,
`comparison`, `preferences`, `permission-priming`, `processing`,
`app-demo`, `value-delivery`, `account-gate`, `paywall`) with progress
persistence, resume, analytics events and an error boundary:

```tsx
import { OnboardingFlow, healthOnboardingTemplate } from "@umituz/web-dashboard/onboarding";

<OnboardingIntlProvider labels={myLabels}>
  <OnboardingFlow config={healthOnboardingTemplate({ onComplete })} />
</OnboardingIntlProvider>
```

Screen selection logic ships as pure functions (`calc`, `predicates`,
`validation` entry blocks), option/question UI as design-system molecules
(`OptionCard`) and atoms (`Button`, `Progress`, `Spinner`). Styles are the
`udb-onb-*` block inside `styles.css`; transitions use `framer-motion`.
Templates: `healthOnboardingTemplate`, `artOnboardingTemplate`,
`videoOnboardingTemplate`, `platformOnboardingTemplate` (plus
`withDefaultDemo` for demo fallbacks). Labels localize through
`OnboardingIntlProvider`; `defaultOnboardingLabels` lists every overridable
string.

### Calendar

```tsx
import { CalendarService, createInMemoryCalendarDatabase } from "@umituz/web-dashboard/calendar/services";

// Bring your own backend:
class MyDatabase implements ICalendarDatabase { /* ... */ }
const service = new CalendarService(new MyDatabase());
// or demo/test:
const demo = new CalendarService(createInMemoryCalendarDatabase());
```

### Notifications

Feed state is provider-owned; the host owns persistence. Records carry
`{ id, type, title?, body?, read?, at | createdAt, severity?, link? }` —
either timestamp column is accepted and `critical` severity normalizes to
`danger`. Reads and dismisses apply optimistically while the callbacks persist.

```tsx
import { NotificationsProvider } from "@umituz/web-dashboard/notifications";
import { NotificationCenter, NotificationsPage } from "@umituz/web-dashboard/notifications/components";

<NotificationsProvider
  notifications={feed}                    // fresh array re-seeds the copy
  loaded={!loading}
  onMarkAllRead={() => api.post("/api/notifications/mark-read")}
  onMarkRead={(id) => api.post(`/api/notifications/${id}/read`)}
>
  <NotificationCenter viewAllTo="/notifications" />  {/* bell + badge, popover or drawer */}
</NotificationsProvider>

// Route body — segments derive from typeMeta counts; "Unread (n)" is built in:
<NotificationsPage typeMeta={TYPE_META} attentionLabel="Needs attention" />
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
(`analytics.chart.title` → "Chart title") so a bare install still renders
readably. The per-domain key catalogs are the string contract:

```ts
import { ANALYTICS_KEYS } from "@umituz/web-dashboard/analytics";
import { SETTINGS_ADMIN_KEYS } from "@umituz/web-dashboard/settings/utils";
import { PERMISSIONS_KEYS } from "@umituz/web-dashboard/permissions";
```

## Platform compatibility

- React 18 and 19, react-router-dom 6 and 7
- Rendering targets the DOM; React Native is not supported

## Development

```bash
npm install
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm test            # vitest unit tests (pure utils + module builders)
npm run test:watch
```

## License

MIT
