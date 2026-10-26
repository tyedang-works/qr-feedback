# QR Feedback — AI Context

## 1. Project Overview

QR Feedback is a restaurant customer feedback management system.

Main workflow:

- Customers scan a table QR code.
- Customers submit feedback through a form.
- Feedback is stored in Supabase.
- Feedback notifications are sent by email using Resend.
- Restaurant staff review and manage feedback in the dashboard.
- Authorized restaurant owners manage staff accounts and roles.

## 2. Tech Stack

- Next.js `16.3.6` using the App Router
- React and React DOM `19.2.8`
- TypeScript `^5`
- Material UI (`@mui/material`) and `@mui/material-nextjs` `^9.4.0`
- Emotion: `@emotion/cache` `^11.14.0`, `@emotion/react` `^11.14.0`, `@emotion/styled` `^11.14.1`
- Supabase: `@supabase/ssr` `^0.12.7`, `@supabase/supabase-js` `^2.117.2`
- Formik `^2.4.9` and Yup `^1.7.1`
- Resend `^6.29.0` for email
- Upstash Redis `^1.39.0` and `@upstash/ratelimit` `^2.2.0` for rate limiting
- `react-easy-crop` `^6.2.4` for image cropping
- `lucide-react` `^1.56.0` for icons
- `qrcode.react` `^4.2.0` for QR code rendering
- Recharts `^3.10.1` for charts
- `xlsx` `^0.18.5` for spreadsheet operations
- ESLint `^9`, `eslint-config-next` `16.3.6`, `eslint-config-prettier` `^10.1.8`, Prettier `^3.9.9`, `dotenv` `^18.0.5`, and `babel-plugin-react-compiler` `1.0.0` are development dependencies.
- Node type definitions `^20`; React and React DOM type definitions `^19`.
- Deployment target previously used: Vercel

Available scripts:

- `npm run dev` — `next dev`
- `npm run build` — `next build`
- `npm run start` — `next start`
- `npm run lint` — `eslint`
- `npm run format` — `prettier --write .`
- `npm run format:check` — `prettier --check .`

## 3. Code Conventions

- Use TypeScript.
- Prefer reusing existing components, helpers, styles, constants, and server actions.
- Do not invent component props, APIs, exports, or file paths.
- Inspect the current implementation before refactoring.
- When implementing a requested code change, provide the complete updated file when the user asks for the full file; do not return only disconnected snippets.
- Keep changes scoped to the requested feature.
- Preserve existing working behavior and avoid unrelated UI or logic changes.
- Do not ask the user to resend code or files that are already available in the conversation or project context.
- Do not claim that lint, build, tests, or deployment passed unless actually run and verified.
- When a requested edit depends on uncertain project details, inspect the existing source first instead of guessing.

### React, Next.js, and MUI

- Follow the existing Next.js App Router conventions.
- Keep server-only code and secrets out of client components.
- MUI System/layout properties such as `direction`, `alignItems`, `justifyContent`, `spacing`, and `flexWrap` should be placed inside the component's `sx` prop, rather than passed as standalone props, following this project's convention.
- Set `Typography` `fontWeight` inside `sx`.
- Follow current MUI APIs and verify the installed version before using version-specific APIs.
- Avoid changing component dimensions, spacing, wrapping, layout, or interaction when the request is only about color or visual styling.

### Forms

- Use `<Formik>` with render props.
- Do not use the `useFormik` hook.
- Use Yup for validation where appropriate.
- Reuse `QRTextField` and other existing form components.
- `QRTextField` uses the `errorMessage` prop for validation errors.
- Preserve existing validation, submission, loading, and error behavior unless explicitly asked to change it.

## 4. UI, Styling, and Theme Rules

- Reuse `cardSx` from the existing shared card styles.
- Reuse `buttonBaseSx`, `buttonBaseCancelSx`, `chipBaseSx`, and other existing shared styles where applicable.
- Prefer the project's existing CSS variables for colors so Light Mode and Dark Mode stay consistent.
- Avoid hardcoded colors when a suitable existing CSS variable is available.
- Do not substitute MUI theme palette values for CSS variables when the requested/project convention is to use CSS variables.
- Before adding a variable, inspect the existing theme stylesheet and naming conventions. Do not assume a theme selector such as `[data-theme="dark"]` without checking the project.
- Keep UI responsive and verify mobile behavior when relevant.
- Keep changes minimal and focused. Do not redesign surrounding UI unless explicitly requested.

### Shared card styling

- Cards should not have a visible border.
- Use the existing shared card shadow/style rather than introducing a new shadow for individual cards.
- Do not add extra card padding or wrappers that interfere with sticky elements or create awkward spacing.
- Do not introduce nested scroll containers or a second scrollbar unless the user explicitly requests that behavior.

### Icons and summary cards

- Use `lucide-react`
- For summary cards, use the existing `--color-primary` CSS variable for icon color when that is the established design requirement.
- Keep icon background colors subtle and appropriate for both light and dark themes; avoid vivid or high-contrast backgrounds that do not fit the existing palette.

### CSS variables confirmed in `globals.css`

The `globals.css` defines Light Mode through `:root, :root[data-theme="light"]` and Dark Mode through `:root[data-theme="dark"]`

Global styling:

- `box-sizing: border-box` applies to all elements.
- `html` and `body` have zero margin and padding.
- Font family is `var(--font-momo-trust-sans), sans-serif`.
- `html` and `body` use `--color-background`; body text uses `--color-text-primary`.
- `body` has `min-height: 100vh`.
- Sidebar widths: `--sidebar-width: 260px` and `--sidebar-collapsed-width: 72px` in Light Mode. These are declared in the Light Mode root and therefore remain inherited in Dark Mode unless overridden elsewhere.

Core theme variables:

| Variable                 | Light Mode                                                                       | Dark Mode                      |
| ------------------------ | -------------------------------------------------------------------------------- | ------------------------------ |
| `--color-primary`        | `#111827`                                                                        | `#f9fafb`                      |
| `--color-background`     | `#ffffff`                                                                        | `#111827`                      |
| `--color-surface`        | `#ffffff`                                                                        | `#1f2937`                      |
| `--color-surface-hover`  | `#f9fafb`                                                                        | `#374151`                      |
| `--color-surface-active` | `#f3f4f6`                                                                        | `#374151`                      |
| `--color-text-primary`   | `#111827`                                                                        | `#f9fafb`                      |
| `--color-text-secondary` | `#6b7280`                                                                        | `#d1d5db`                      |
| `--color-text-muted`     | `#9ca3af`                                                                        | `#9ca3af`                      |
| `--color-border`         | `#f0f1f3`                                                                        | `#374151`                      |
| `--shadow-card`          | `0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)` | `0 1px 3px rgba(0, 0, 0, 0.2)` |
| `--color-chart-track`    | `#e5e7eb`                                                                        | `#374151`                      |

Input and button variables:

| Variable                        | Light Mode | Dark Mode |
| ------------------------------- | ---------- | --------- |
| `--color-input-background`      | `#ffffff`  | `#1f2937` |
| `--color-input-border`          | `#d0d5dd`  | `#374151` |
| `--color-input-border-hover`    | `#98a2b3`  | `#6b7280` |
| `--color-input-focus`           | `#193b56`  | `#93c5fd` |
| `--color-button-primary-bg`     | `#193b56`  | `#34465d` |
| `--color-button-primary-text`   | `#ffffff`  | `#f9fafb` |
| `--color-button-primary-hover`  | `#244e6c`  | `#405570` |
| `--color-button-primary-active` | `#16344b`  | `#29394e` |
| `--color-button-delete-bg`      | `#d92d20`  | `#d92d20` |
| `--color-button-delete-hover`   | `#b42318`  | `#b42318` |

Table, skeleton, and role variables:

| Variable                        | Light Mode    | Dark Mode                    |
| ------------------------------- | ------------- | ---------------------------- |
| `--color-status-success`        | `#039855`     | `#426b57`                    |
| `--color-table-edit`            | `#193b56`     | `#a7b4c7`                    |
| `--bg-table-edit-hover`         | `#f2f4f7`     | `rgba(147, 197, 253, 0.08)`  |
| `--color-table-delete`          | `#d92d20`     | `#f87171`                    |
| `--bg-table-delete`             | `transparent` | `transparent`                |
| `--bg-table-delete-hover`       | `#fef3f2`     | `rgba(248, 113, 113, 0.1)`   |
| `--color-table-header-bg`       | `#f9fafb`     | `#293548`                    |
| `--color-table-header-text`     | `#1a202e`     | `#d5dde8`                    |
| `--color-skeleton`              | `#e5e7eb`     | `#374151`                    |
| `--color-donut-skeleton`        | `#dde3eb`     | `#465368`                    |
| `--color-donut-skeleton-center` | `#ffffff`     | `var(--color-card, #1f2937)` |
| `--color-role-owner-text`       | `#237a62`     | `#6ee7b7`                    |
| `--color-role-owner-bg`         | `#eaf3f0`     | `rgba(16, 185, 129, 0.14)`   |
| `--color-role-owner-border`     | `#cde5dc`     | `rgba(110, 231, 183, 0.24)`  |
| `--color-role-manager-text`     | `#315ea8`     | `#93c5fd`                    |
| `--color-role-manager-bg`       | `#eef4ff`     | `rgba(59, 130, 246, 0.14)`   |
| `--color-role-manager-border`   | `#d6e4ff`     | `rgba(147, 197, 253, 0.24)`  |
| `--color-role-staff-text`       | `#475467`     | `#d1d5db`                    |
| `--color-role-staff-bg`         | `#f2f4f7`     | `rgba(156, 163, 175, 0.14)`  |
| `--color-role-staff-border`     | `#e4e7ec`     | `rgba(209, 213, 219, 0.2)`   |

Dashboard feedback-status variables (`--feedback-status-*`):

| Status      | Light Mode text / background / border | Dark Mode text / background / border |
| ----------- | ------------------------------------- | ------------------------------------ |
| New         | `#9a5b13` / `#f8f0e4` / `#e9d8be`     | `#d9b27c` / `#352d23` / `#594633`    |
| In progress | `#526b83` / `#edf1f5` / `#d5dde5`     | `#a9bbcb` / `#2a333d` / `#414d5a`    |
| Resolved    | `#39745c` / `#eaf2ed` / `#cfe0d5`     | `#9bc5ad` / `#25372f` / `#3c5548`    |

Feedback-item status variables (`--color-feedback-status-*`):

| Status      | Light Mode text / background / border | Dark Mode text / background / border |
| ----------- | ------------------------------------- | ------------------------------------ |
| New         | `#a83232` / `#fdecec` / `#f1caca`     | `#f0a0a0` / `#352527` / `#624044`    |
| In progress | `#805b20` / `#f5f0e6` / `#e8dcc3`     | `#d9bb83` / `#332e25` / `#594b35`    |
| Resolved    | `#286747` / `#eaf3ed` / `#cfe2d5`     | `#9bc5ad` / `#25372f` / `#3c5548`    |

Other dashboard variables:

- Chart colors: Light Mode defines `--color-chart-new: #e5484d`, `--color-chart-in-progress: #d97706`, `--color-chart-resolved: #16a34a`, `--color-chart-current: #16806a`, `--color-chart-previous: #b8d8d0`, `--color-chart-legend-current: #55b8a5`, and `--color-chart-legend-previous: #9bbdb4`. Dark Mode overrides these with `#f04438`, `#f79009`, `#12b76a`, `#54b8a0`, `#536f68`, `#55b8a5`, and `#526f67`; it also defines `--color-chart-label: #a1a1aa`.
- Pagination: Light Mode uses text `#52525b`, hover `#f4f4f5`, selected background `#18181b`, selected text `#ffffff`, border `#d4d4d8`, disabled text `#d4d4d8`, and disabled border `#e4e4e7`. Dark Mode uses text `#d1d5db`, hover `#374151`, selected background `#e5e7eb`, selected text `#111827`, border `#4b5563`, disabled text `#6b7280`, and disabled border `#374151`.
- Feedback-item hover: Light Mode `--color-feedback-item-hover-bg: #f1f5f9`, `--color-feedback-item-hover-border: #cbd5e1`, `--shadow-feedback-item-hover: 0 2px 8px rgba(15, 23, 42, 0.08)`; Dark Mode `#354256`, `#64748b`, and `0 2px 8px rgba(0, 0, 0, 0.2)`.
- Feedback issue chips: Light Mode food quality `#fef0f0/#f3caca/#b42318`; food presentation `#f4f0ff/#d9ccff/#6941c6`; service `#eff8ff/#b2ddff/#175cd3`; cleanliness `#ecfdf3/#abefc6/#067647`; service time `#fff1f3/#fecdd6/#c01048` (background/border/text). Dark Mode respectively: `#3b2529/#704047/#fda29b`; `#302747/#514071/#c6b5ff`; `#1e3047/#345579/#84caff`; `#20382f/#345b49/#75e0a7`; `#402630/#70404f/#fea3b4`.
- `--color-tab-selected` and `--color-tab-indicator`: Light Mode both `#193b56`; Dark Mode `#f9fafb` and `#d1d5db`.
- `--color-button-delete-bg` and `--color-button-delete-hover` are currently the same in both themes (`#d92d20` and `#b42318`).

Important source-accuracy note:

- The table, status, role, chart, pagination, and issue-chip variables above are present in the supplied CSS. Recheck the actual stylesheet before adding or renaming variables.

### Table UI behavior and visual requirements

- Keep table action buttons visually restrained and consistent with the current design.
- The “Chỉnh sửa” button should remain transparent at rest and use `--color-table-edit` for text and `--bg-table-edit-hover` on hover. Do not make it a solid button or change its dimensions unless requested.
- Delete action styling should use subdued red tones and remain transparent at rest unless the user explicitly asks for a filled destructive button.
- Keep table header labels visually consistent; do not apply a special text color to only the “Thao tác” column unless requested.
- The table header should be slightly taller when required by the latest UI request, with modest rounded corners.
- The sticky table header should work with the page's normal scrolling. Do not solve it by adding an inner vertical scroll container that creates a second scrollbar.
- When debugging sticky behavior, inspect ancestor `overflow`, positioning, and layout styles. Do not apply `overflow: hidden`, `clip`, or another overflow value blindly, because it can affect sticky positioning.
- Avoid adding top padding to the table card if it creates a visible gap or disrupts the sticky header.
- Keep the current grid columns, action alignment, and responsive behavior unless the requested change requires otherwise.

### Dialogs and dark mode

- Shared `QRDialog` header and footer should respect the active theme and match the dialog body.
- Prefer existing CSS variables for dialog surfaces, borders, text, and hover states where available.
- Keep dialog layout, padding, transitions, and component structure unchanged when the task is only to correct dark-mode colors.
- In confirmation dialogs, keep body text and helper text legible in both themes.

## 5. Authentication and Roles

Roles:

- `OWNER`
- `MANAGER`
- `STAFF`

Known permission rules:

- Owner can manage restaurant settings and users.
- Owner and Manager can manage tables.
- Owner and Staff can access and manage feedback.
- QR code access follows `canViewQRCodes`.

Always inspect `src/lib/auth/permissions.ts` before changing authorization. Use the actual role constants and helper functions exported by the project.
Server actions must validate authentication, permissions, input data, and restaurant ownership on the server. Never trust client-supplied role, user ID, or restaurant ID for authorization.

## 6. Supabase Client Patterns

Inspect the current files before changing these patterns.

### Admin client — `src/lib/supabase/admin.ts`

- Uses `createClient` from `@supabase/supabase-js`.
- Uses the public Supabase URL and server-only `SUPABASE_SECRET_KEY`.
- Auth options disable session persistence and token refresh.
- Use only in trusted server-side code. Never expose the secret key to the browser.

### Server client — `src/lib/supabase/server.ts`

- Uses `createServerClient` from `@supabase/ssr` and cookies from `next/headers`.
- Is asynchronous when it awaits `cookies()`.
- Uses the public Supabase URL and publishable key.
- For authenticated server actions, use the server client and verify the current user with `supabase.auth.getUser()`.

### Browser client — `src/lib/supabase/browser.ts`

- Uses `createBrowserClient` from `@supabase/ssr`.
- Uses public URL and publishable key only.
- Never use the admin client in client components.

## 7. Shared Components and Styles

Reuse existing components where applicable:

- `QRTextField`
- `QRSelect`
- `QRDialog`
- `QRSnackbar`
- `TabBar`
- Existing common loading/skeleton components

Shared styles include:

- `cardSx`
- `buttonBaseSx`
- `buttonBaseCancelSx`
- `chipBaseSx`
  Verify actual exports, prop types, and paths before importing. Do not create a duplicate component when an existing shared component already fits the task.

## 8. Tables and QR Codes

- Table management UI is in the dashboard's Tables feature; inspect current files and imports before editing.
- `canManageTables` determines whether table management actions should be shown.
- Table list filtering includes table name/token search and status filtering. Preserve current filtering behavior unless requested.
- Existing status options are `all`, `active`, and `inactive`; table sorting options have included `name_asc` and `name_desc`. Confirm current constants before changing them.
- Existing pagination conventions include `DEFAULT_PAGE = 1`, `DEFAULT_PAGE_SIZE = 10`, and page sizes `[10, 25, 50]` in the QR code feature. Confirm the relevant feature constants rather than assuming they are shared across all pages.
- Keep mobile table cards and desktop table rows responsive.
- For sticky table headers, use the page's normal scroll behavior and avoid creating a second vertical scrollbar.
- Preserve table status switch layout and tune only its colors when the request is specifically about color.
- Current preferred dark-mode switch track is muted rather than vivid. Verify the existing switch styling before changing values.
- QR code printing layout should keep the table label and “Quét mã để gửi phản hồi” text above the QR code with compact, balanced spacing.

## 9. Feedback Feature

- Feedback submissions are stored in Supabase and feedback notifications are sent through Resend.
- Existing validation includes a required Vietnamese phone number, allowed feedback options, and a feedback text length limit. Inspect the current API/server action for the authoritative rules before changing them.
- Rate limiting has been implemented with Upstash Redis and `@upstash/ratelimit`; preserve and verify it when changing submission handling.
- Existing feedback dashboard components include toolbar, list, pagination, and summary components. Reuse them rather than duplicating behavior.
- Search should support Vietnamese text reliably. Inspect normalization and database search behavior before changing search logic.
- Keep the feedback dashboard responsive and avoid excessive left/right padding.
- Filter controls should remain user-friendly and should not expose redundant controls when an existing popup/filter pattern is in place.
- For loading states, skeletons should reflect the actual page layout and use the theme's CSS variables where available.

## 10. Users & Roles — Add User

### Current add-user flow

The known flow included:

1. Authenticate the current user with the server Supabase client.
2. Read the current profile and check `canManageUsers`.
3. Validate full name, normalized email, role (`MANAGER` or `STAFF`), and optional avatar.
4. Create an Auth user through the admin client with email confirmation not yet completed.
5. Create the corresponding `profiles` row associated with the Owner's restaurant.
6. Roll back created records if profile or avatar creation fails.
7. Optionally upload an avatar to the `profile-avatars` bucket and update `profiles.avatar_url`.
8. Revalidate relevant dashboard routes.
   Inspect the latest `addUserAction` and `AddUserDialog` before relying on these details

## 11. Profile Feature

Current implementation previously identified:

- Route: `/dashboard/profile`
- UI: `src/components/profile/ProfilePage.tsx`
- Server actions: `src/app/dashboard/profile/actions.ts`
- Fields: full name, email, role, avatar.
- Email and role are read-only.
- Full name and avatar can be updated.
- Avatar storage bucket: `profile-avatars`
- Accepted formats: PNG, JPEG, WebP.
- Maximum file size: 1 MB.
- Profile form uses Formik render props and Yup.
- Avatar selection uses a hover overlay labelled “Update photo”.

### Avatar cropping

- Reuse the existing `react-easy-crop` implementation and `createCroppedFile` helper;
- Use a 1:1 crop for profile avatars.
- Update the preview only after the user confirms the crop.
- Upload only when the user clicks Save.
- Canceling the crop must preserve the previously selected avatar preview.
- Revoke temporary object URLs to avoid memory leaks.
- Keep server-side MIME type and file-size validation.

## 12. Branding Feature

- Restaurant logo and favicon are managed in Settings.
- Storage bucket: `restaurant-branding`.
- Branding uploads are handled by server actions.
- Reuse the existing crop implementation instead of duplicating it.
- Default favicon path: `/assets/favicon.ico`.
- Inspect the current Branding implementation and shared crop helpers before modifying them.

## 13. Database and Storage

- Supabase is used for authentication, database, and file storage.
- Known `profiles` fields include `full_name`, `role`, `restaurant_id`, and `avatar_url`.
- `restaurants` stores restaurant settings and branding URLs.
- The `profile-avatars` bucket stores user avatars.
- The `restaurant-branding` bucket stores restaurant logos and favicons.
- The full current database schema has not been established by this context document.
- Verify current schema, constraints, indexes, RLS policies, and storage policies before making database or storage changes.
- Do not claim that an SQL migration or policy is correct without checking it against the actual schema.

## 14. Deployment and Environment

- The project has been deployed to Vercel.
- Keep secrets in environment variables; never commit `.env.local` or expose server-only secrets.
- Confirm environment variable names against the current code and deployment settings before changing configuration.
- Do not claim production behavior has been verified based only on local code or a successful build.

## 15. Source-of-Truth and Context Maintenance

- `package.json` is authoritative for installed package versions and available npm scripts.
- `globals.css` is authoritative for global reset rules, theme selectors, and CSS variable names/values.
- Do not treat an installed dependency as proof that it is actively used in application code.
- This context describes previously observed project behavior and conventions, not a substitute for inspecting the current implementation. Verify source files before changing features or preparing technical documentation that asserts implementation details.

## 16. Workflow for AI-Assisted Changes

Before implementing a task:

1. Read this context file.
2. Inspect the relevant current source files and existing UI.
3. Confirm actual APIs, props, exports, routes, server actions, CSS variables, and schema.
4. Reuse existing patterns and integrations.
5. Implement only the requested scope.
6. Preserve working logic and existing layout unless the user explicitly asks for a change.
7. For file-edit requests, return the complete updated file when requested, not only partial snippets.

After implementing:

1. Run lint and build when appropriate and available.
2. Fix errors introduced by the changes.
3. Report exactly which files and behavior changed.
4. Clearly state whether lint/build was actually run and its result.
5. Update this context file when architecture, conventions, completed work, or next steps materially change.

Never claim lint, build, tests, or deployment passed unless actually verified. Distinguish facts confirmed from supplied source code from assumptions that still require repository or database inspection.
