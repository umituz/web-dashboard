# @umituz/web-dashboard — Test Scenarios

This document is the **manual QA playbook** for the `@umituz/web-dashboard`
package. Each scenario is a step-by-step flow that a human tester can
execute in a browser (or via Storybook) to verify behavior, with the
expected outcome on success and the failure mode on regression.

> **Audience**: QA engineers, frontend developers, and any consumer
> integrating the dashboard into their app.
>
> **Conventions**
> - ✅ = expected pass state
> - ❌ = expected fail / regression
> - All copy is **i18n-keyed**; the tester should see localized strings
>   matching their selected locale (default `en-US`).
> - All test data is **user-controlled** — never use hard-coded mock
>   users, names, or card numbers.

---

## 0. Environment Setup

1. Install the package in a host app (e.g. `npm install @umituz/web-dashboard`).
2. Ensure peer deps are present: `react@^18|^19`, `react-dom`,
   `react-router-dom@^6|^7`, `firebase@^10|^11|^12`,
   `@umituz/web-firebase@^3.0`, `@umituz/web-polar-payment@^1.0.20`.
3. Wrap the app in a configured `I18nextProvider` and (if using
   Firebase) a Firebase app.
4. Inject an `AuthProvider`, `AnalyticsApiClient`, and `BillingApiClient`
   from your app — the library no longer ships with mock data.

```tsx
// Example wiring
const apiClient = createStubAnalyticsApiClient({ /* ... */ });
<AuthProvider authProvider={firebaseAuth}>
  <Dashboard billingApiClient={billingClient} analyticsApiClient={apiClient} />
</AuthProvider>
```

---

## 1. Auth Domain

### 1.1 LoginForm — happy path

1. Open the login page.
2. ✅ The form renders a brand title, "Welcome back" heading, and an
   email + password field.
3. Type a valid email (e.g. `qa+1@example.com`) and a valid password.
4. Click **Sign in**.
5. ✅ The button shows a spinner; the form fields are disabled.
6. ✅ On success, the user is redirected to `config.afterLoginRoute`.
7. ✅ The "Sign in" button is replaced by the configured loading state
   while the request is in flight.

**Failure modes**
- ❌ "Invalid email" appears when the email is missing → must be the
  `auth.validation.emailRequired` i18n key.
- ❌ "Invalid email format" → must be `auth.validation.emailInvalid`.
- ❌ Spinner stays forever → API client never resolves; check network.

### 1.2 LoginForm — error path

1. Submit the form with an email that returns a server error.
2. ✅ An `AuthErrorBanner` appears at the top with `role="alert"`.
3. ✅ The error message is the server's message, not a hard-coded
   string.
4. ✅ The form is re-enabled so the user can retry.

**Failure modes**
- ❌ The error is logged to console only (silent error swallowing).
- ❌ The form stays disabled after a failure.

### 1.3 LoginForm — social login

1. Click the **Google** or **Apple** button.
2. ✅ The corresponding `onGoogleLogin` / `onAppleLogin` callback fires.
3. ✅ The buttons are disabled while the form is loading.

**Failure modes**
- ❌ Clicking the button does nothing (no-op handler).
- ❌ Icons are emoji (must be `GoogleIcon` / `AppleIcon` SVG).

### 1.4 RegisterForm — happy path

1. Open the registration page.
2. Fill: full name, valid email, valid password (≥ 8 chars), confirm
   password, accept terms.
3. ✅ The password strength indicator fills based on length + variety
   (Weak / Fair / Good / Strong — no raw numbers).
4. ✅ "Passwords do not match" error shows when confirm ≠ password.
5. Click **Create account**.
6. ✅ On success, redirect to `afterLoginRoute`.
7. ✅ If no `onRegisterAttempt` is provided, the form throws an
   explicit "No register handler configured" — it does NOT silently
   insert a mock user.

**Failure modes**
- ❌ A fake "John Doe" user is created when the API is missing.
- ❌ Submit succeeds with empty name, email, or password.

### 1.5 RegisterForm — terms checkbox

1. Submit without checking the terms checkbox.
2. ✅ "You must agree to the terms and conditions" error appears.

### 1.6 ForgotPasswordForm

1. Enter an email and submit.
2. ✅ Success state shows a check-circle icon, the email address, and
   three numbered steps (using lucide `Check` icons, NOT `✓` Unicode).
3. ✅ The "Back to sign in" button uses the React Router `<Link>`,
   not a hard `href`.

**Failure modes**
- ❌ Success screen uses `✓` emoji glyphs.
- ❌ Full page reload on "Back to sign in" (means an `<a href>` was
  used instead of `<Link>`).

### 1.7 ResetPasswordForm

1. Open the reset-password page with a valid `token` prop.
2. Enter a new password and confirm.
3. ✅ The shared `PasswordStrengthIndicator` renders the localized
   band label.
4. Submit.
5. ✅ "Password reset successful" success state renders, with a
   "Go to sign in" button.

**Failure modes**
- ❌ Password strength bands are hard-coded English ("Weak", "Strong").
- ❌ Submit succeeds with mismatched passwords.

---

## 2. Onboarding Domain

### 2.1 OnboardingWizard — navigation

1. Mount `<OnboardingWizard config={...} />` with 4 steps.
2. ✅ The wizard shows a step indicator with numbered nodes.
3. Click **Next** on step 1 without selecting an option.
4. ✅ If the step has a `validate` function, navigation is blocked.
5. Select an option and click **Next**.
6. ✅ The next step renders, the indicator advances, and the
   "Back" button appears (it was hidden on step 1).
7. Click **Back** — return to step 1.

**Failure modes**
- ❌ "Next" advances even when validation should block it.
- ❌ State (`currentStep`) desynchronizes between header and content.
- ❌ The `useOnboarding` hook is not used (state leaks into the
  wizard — only an issue if state isn't propagated).

### 2.2 OnboardingWizard — completion

1. Fill all steps and click **Get started** on the last one.
2. ✅ A spinner appears in the submit button.
3. ✅ If `onComplete` throws, an error banner with `role="alert"`
   appears. The button re-enables.
4. ✅ On success, navigate to `config.completeRoute`.

**Failure modes**
- ❌ The error is only `console.error`-ed.
- ❌ The spinner is missing or never resets.

### 2.3 UserTypeStep

1. ✅ Renders 6 default options (Founder, Content Creator, etc.) with
   all labels resolved via `t(labelKey)`.
2. Click an option.
3. ✅ The selected option gets a primary ring + check icon.
4. ✅ Other options deselect (radio-group semantics).

**Failure modes**
- ❌ Multiple options can be selected at once (not a real radio group).
- ❌ Labels are hard-coded English.

### 2.4 PlatformsStep

1. ✅ Renders 7 platforms (Instagram, Twitter/X, …) with Lucide
   icons and brand-accurate gradient backgrounds.
2. Click a platform.
3. ✅ The platform card is marked `aria-pressed="true"` and a
   "Connected" badge appears.
4. Click again — toggles off.
5. ✅ The footer status text says "N platform(s) selected" with
   proper pluralization.

**Failure modes**
- ❌ Platform icons are emoji (📸, 🐦, etc.).
- ❌ The status text uses ✨ sparkle emoji.

### 2.5 PlanStep

1. ✅ Renders 3 default plans (Standard, Pro, Enterprise).
2. Click a plan — the selected card has a primary border.
3. Toggle to **Yearly** — the price is recalculated using the
   `yearlyDiscountPercent` (default 20) — the displayed discount
   matches the actual savings.
4. Click a plan and observe the success footer (sparkle icon +
   "Great choice! You selected the X plan").

**Failure modes**
- ❌ Discount shown in the toggle differs from the actual savings.
- ❌ Yearly price is `monthly * 12` without any discount.

### 2.6 AppFocusStep

1. ✅ Two options (Mobile, Web) with `Smartphone` / `Monitor` icons.
2. Click Mobile — the option shows a primary ring + check.
3. Click Web — both can be selected (multi-select).
4. ✅ A success message ("Great choice!") appears with a `Sparkles`
   icon (NOT emoji).

**Failure modes**
- ❌ Icons are 📱 / 💻 emoji.
- ❌ Toggle is hard-coded by `id === "mobile"` string match.

---

## 3. Billing Domain

### 3.1 BillingPage / BillingLayout

1. Mount with a `config` that has a brand name, support email, and
   cancel route.
2. ✅ The header shows the brand logo + brand name.
3. ✅ The footer shows "Need help? Contact {email}" with a
   localized mailto link.
4. Click "Back to Dashboard" — uses React Router (no full reload).

**Failure modes**
- ❌ Footer hard-codes "Growth Factory" when brandName is missing.
- ❌ `<a href="/dashboard">` causes a full page reload.

### 3.2 BillingPortal — tabs

1. Mount with `activeTab="overview"`.
2. ✅ The Overview tab is selected (aria-selected=true, tabIndex=0).
3. Use the keyboard: press Right Arrow on a tab.
4. ✅ Focus moves to the next tab; the panel updates.
5. Use Left Arrow — focus wraps around.
6. Click each tab — content switches; previous tab is
   `aria-selected=false` and `tabIndex=-1`.

**Failure modes**
- ❌ Tabs are not in a `role="tablist"`.
- ❌ Arrow keys do not move focus between tabs.
- ❌ The panel does not declare `role="tabpanel"`.

### 3.3 OverviewTab

1. ✅ Shows current plan, status color, price, and trial-days-remaining
   (if trialing).
2. ✅ Shows upcoming invoice amount and due date.
3. ✅ If `usage` is non-empty, renders a grid of `UsageCard` items.

**Failure modes**
- ❌ Date string shows raw `"Invalid Date"`.
- ❌ Currency formatting ignores locale.

### 3.4 PaymentMethodsList

1. With no payment methods, shows the empty state + "Add Payment
   Method" button.
2. With methods, the default method has a primary border and a
   "Default" badge.
3. Click the trash icon — a confirmation strip appears (not a modal)
   with "Remove" and "Cancel" actions.
4. ✅ The last remaining method cannot be removed.
5. Click "Set as default" on a non-default method — its `onSetDefault`
   callback fires; the badge moves to it.

**Failure modes**
- ❌ Removing the only payment method succeeds (data loss).
- ❌ No confirmation step (accidental click deletes the card).
- ❌ Brand-agnostic gradient on every card (Visa looks like Amex).

### 3.5 InvoiceCard

1. ✅ Renders invoice number, amount, status, and due date.
2. Click "view invoice" / "download PDF" — opens external URL with
   `noopener,noreferrer` (verify in DevTools that the link's
   `rel` includes both).
3. Click the card body — the parent's `onClick` fires (and is
   keyboard-accessible via Enter / Space).

**Failure modes**
- ❌ `window.open(url, "_blank")` without rel="noopener noreferrer"
   (tabnabbing vulnerability).
- ❌ Card is a clickable `<div>` without role/tabIndex (no keyboard
   access).

### 3.6 PlanComparison

1. ✅ Renders all plans in a grid; clicking selects a plan.
2. Toggle Monthly/Yearly — the price and discount update.
3. ✅ The discount shown in the toggle matches the actual savings
   (no more hard-coded "17%" mismatch).
4. The currently-selected plan shows "Current Plan" (disabled state).
5. Plan cards use proper radio-group semantics (`role="radiogroup"`,
   `aria-checked`).

**Failure modes**
- ❌ Toggle shows "Save 17%" but the actual discount is 20% (mismatch).
- ❌ Multiple plans can be selected.

### 3.7 PlanTab (replaces "coming soon")

1. ✅ Shows the active plan, billing period dates, and a
   "Change plan" / "Cancel subscription" action area.
2. Click "Cancel subscription" — the button switches to a
   destructive variant with a "Confirm cancel" prompt.
3. Click "Confirm cancel" — `onCancelSubscription` is awaited; a
   loading state is shown.

**Failure modes**
- ❌ "Plan management coming soon..." placeholder.
- ❌ Cancel is immediate, no confirmation step.

### 3.8 UsageCard

1. ✅ Shows current / limit and a localized progress bar.
2. ✅ When over 100%, the percentage text still shows the real
   value (e.g. "120%"), but the bar caps at 100% visually.
3. ✅ Limit <= 0 hides the progress bar entirely (no divide-by-zero).
4. ✅ The bar has `role="progressbar"`, `aria-valuenow`, and a
   localized `aria-valuetext`.

**Failure modes**
- ❌ Bar always shows 100% when actual usage is 150%.
- ❌ The bar has no a11y role (screen readers can't read it).

### 3.9 useBilling hook

1. With no `apiClient`, the hook throws a clear error if any action
   is invoked (no silent mock).
2. With a real `apiClient`, the `loadBilling` action updates state
   on success and surfaces errors to state AND re-throws.
3. ✅ `error: null` is set when starting a new action; loading is
   `true` while in flight.

**Failure modes**
- ❌ The hook silently returns mock "John Doe" data when no
   `apiClient` is provided.
- ❌ Errors are swallowed instead of surfaced.

---

## 4. Analytics Domain

### 4.1 AnalyticsLayout

1. ✅ Renders page title, optional period selector, optional
   refresh / export buttons.
2. The refresh button calls `onRefresh` (no `console.log`!).
3. The export button calls `onExport` (no `console.log`!).
4. ✅ Legacy `kpis` prop is gone — only `metrics: Metric[]` is
   accepted.
5. ✅ Loading state shows a spinner with `role="status"`.

**Failure modes**
- ❌ Clicking "Export" only logs to console.
- ❌ Legacy `kpis` prop is still accepted (silently uses `kpis` over
   `metrics`).

### 4.2 MetricCard

1. ✅ Renders metric name, formatted value, and an optional icon.
2. If `previousValue` is provided, shows a trend (up / down / stable)
   with a `success` / `destructive` / `muted` color (no hard-coded
   green/red — uses theme tokens).
3. ✅ When interactive (`onClick`), the card has `role="button"`,
   `tabIndex=0`, and is keyboard-accessible (Enter/Space).

**Failure modes**
- ❌ Card is a clickable `<div>` without role/tabIndex.
- ❌ Trend color is hard-coded `text-green-600` regardless of theme.

### 4.3 AnalyticsChart

1. ✅ Renders the correct Recharts chart for the type (`line`,
   `bar`, `area`, `pie`, `donut`).
2. ✅ Unknown types render a `role="alert"` placeholder, not a
   raw "Unsupported" string.
3. ✅ Pie/donut chart uses a typed `ChartData[]` (no `any`).

**Failure modes**
- ❌ `config.data.map((entry: any, ...))` is present.
- ❌ Magic numbers like `outerRadius={80}` are scattered.

### 4.4 useAnalytics

1. Without `apiClient`, the hook throws (no Math.random mock).
2. ✅ With a real client, two rapid `refresh()` calls don't race —
   the latest request wins (request ID check).
3. ✅ `exportData` downloads a blob using the response from
   `apiClient.exportAnalytics`.

**Failure modes**
- ❌ Mock KPI numbers (e.g. `downloads: 1250`) appear when no
   client is provided.
- ❌ Two rapid refreshes result in stale data being shown last.

---

## 5. Calendar Domain

### 5.1 useCalendar

1. Without `userId`, `refresh` surfaces an error instead of silently
   doing nothing.
2. With a real `CalendarService`, items are loaded on mount.
3. Filter changes trigger a re-fetch.
4. ✅ `createItem` / `updateItem` / `deleteItem` / `moveItem` all
   refresh the list on success.
5. ✅ The latest `onError` callback is always used (stable ref).

**Failure modes**
- ❌ `if (!userId) return;` silently skips.
- ❌ `onError` is captured stale (closure issue).
- ❌ Two parallel fetches overwrite each other.

### 5.2 CalendarService

1. ✅ `transformPolarProductToPlan` throws on unknown currency or
   unsupported interval.
2. ✅ Mapped ContentItems have all required fields (no `undefined`).

**Failure modes**
- ❌ Unknown currency silently coerced to `''`.
- ❌ Missing required fields produce `undefined` instead of throwing.

---

## 6. Settings Domain

### 6.1 SettingsLayout

1. ✅ Route change triggers the loading skeleton for `ROUTE_LOADING_DELAY_MS`
   (200ms) and the timer is cleared on unmount (no memory leak).
2. Click the collapse button on the desktop sidebar — the sidebar
   collapses; the brand name hides.
3. Click the collapse button on mobile — the overlay menu opens
   with a backdrop.

**Failure modes**
- ❌ `setTimeout` is never cleared → memory leak.
- ❌ Hard-coded "Settings" appears in the header.

### 6.2 SettingsSection

1. ✅ Items with no `path` AND no `onClick` are hidden entirely
   (no empty button).
2. Items with `path` render a React Router `<Link>` and get
   `aria-current="page"` when active.
3. Items with `onClick` render a `<button>` with proper keyboard
   support.

**Failure modes**
- ❌ Empty button (no onClick) is rendered.
- ❌ Active link has no `aria-current`.

### 6.3 useSettings

1. ✅ `useReducer` is used internally; action types are discriminated.
2. ✅ Callbacks (`updateItem`, `toggleItem`, `setItemBadge`) are
   stable across renders (no closure issue).

---

## 7. Layouts Domain

### 7.1 DashboardLayout

1. Mount with `isAuthenticated=false` → redirects to `loginRoute`.
2. Mount with `isLoading=true` → renders nothing (or a skeleton).
3. ✅ Notification dropdown shows `role="region"`, unread count
   is announced.
4. ✅ Profile menu links to settings / profile / billing using
   React Router `<Link>`.

**Failure modes**
- ❌ Profile menu uses `<a href>` for SPA navigation (full reload).
- ❌ Notification badge is decorative without aria-label.

### 7.2 DashboardHeader

1. ✅ Theme toggle is a real toggle (light / dark) using
   `useTranslation` for tooltips.
2. ✅ Logout button awaits `onLogout`; if it throws, the error is
   surfaced (not silently swallowed).

---

## 8. Accessibility Sweep

Run this on every screen:

1. ✅ Every interactive element is keyboard-reachable (Tab cycles
   through all controls).
2. ✅ Every icon-only button has an `aria-label` (verify with
   DevTools accessibility inspector).
3. ✅ No emoji is rendered (search for emoji in the rendered DOM).
4. ✅ Form fields have associated `<label>`s (`htmlFor` / wrapping).
5. ✅ Error states use `role="alert"`, success states use
   `role="status"`.
6. ✅ Tab navigation uses `role="tablist"` / `role="tab"` /
   `role="tabpanel"` with proper arrow-key support.
7. ✅ Color contrast meets WCAG AA (use Lighthouse).

---

## 9. Build & Tooling

1. `npm run typecheck` exits with code 0.
2. `npm run lint` exits with code 0 with 0 errors.
3. `npm run build` produces a clean `dist/` (when run on demand).
4. The package exports cleanly:

```ts
import { DashboardLayout, useAuth, BillingPortal, OnboardingWizard } from '@umituz/web-dashboard';
```

5. No default exports leak. No `any` in the public type surface.

---

## 10. i18n Verification

1. Switch the host app's locale to `tr-TR` (or any non-default).
2. ✅ All UI text changes — no English strings remain.
3. ✅ The success / error messages also translate (i18n keys
   everywhere, not hard-coded English).
4. ✅ Date / currency formatting uses the active locale.

**Failure modes**
- ❌ Some text is still English after switching locale.
- ❌ "Back to Dashboard" is hard-coded.
- ❌ Dates show `MM/DD/YYYY` regardless of locale (must be `en-US`
   formatter or active locale).

---

## 11. Regression Checklist

Before each release, run:

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] All auth flows (1.1 – 1.7) — manual
- [ ] Onboarding wizard navigation (2.1, 2.2)
- [ ] Billing tab keyboard navigation (3.2)
- [ ] PaymentMethodsList confirmation strip (3.4)
- [ ] Plan tab cancel confirmation (3.7)
- [ ] UsageCard over-100% display (3.8)
- [ ] AnalyticsChart type fallback (4.3)
- [ ] useAnalytics race condition (4.4)
- [ ] SettingsLayout useEffect cleanup (6.1)
- [ ] i18n locale switch (10)
- [ ] Accessibility sweep (8)

If any of these fail, **block the release**.

---

## 12. Reporting Issues

When a regression is found:

1. Note the scenario number (e.g. `1.2`).
2. Capture: browser, OS, locale, console errors, a screenshot.
3. Open an issue at https://github.com/umituz/web-dashboard/issues
   with the scenario number and reproduction steps.
4. Tag `regression` and the affected domain
   (`auth`, `billing`, `onboarding`, `analytics`, `calendar`,
   `settings`, `layouts`).
