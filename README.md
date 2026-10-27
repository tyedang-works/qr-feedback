# QR Feedback

## Project Introduction
**QR Feedback** is a customer feedback management system designed for restaurants. It streamlines the process of collecting, monitoring, and evaluating customer experiences through QR codes placed at individual dining tables.

Customers can scan a QR code to submit feedback on various aspects of their dining experience, including food quality, food presentation, service quality, dining area cleanliness, and service time. All feedback is stored centrally and displayed on a management dashboard, allowing restaurant staff to conveniently review, search, filter, and manage customer feedback.
The goal of QR Feedback goes beyond simply collecting customer opinions. It helps restaurants turn customer feedback into actionable insights to continuously improve service quality. Positive aspects identified through customer feedback can be maintained and further developed, while issues that fall short of customer expectations can be identified, prioritized, and addressed promptly.
By organizing customer feedback systematically, QR Feedback aims to enhance the overall customer experience, support data-informed decisions, and help restaurants continuously improve their service quality and achieve sustainable growth.

---

## Features

- **QR-code feedback flow** --- each table has a QR code customers can
  scan to open its feedback form.
- **Feedback collection** --- customers can select feedback
  categories, provide a comment, and submit a Vietnamese phone number.
- **Email notifications** --- feedback notifications are sent using
  Resend.
- **Feedback dashboard** --- staff can review feedback, search,
  filter, paginate, and view summary/chart information where
  available.
- **Table and QR-code management** --- authorized users can manage
  tables and print table QR codes.
- **Restaurant settings and branding** --- manage restaurant settings
  and branding assets where supported by the current implementation.
- **User and role management** --- restaurant owners can manage staff
  accounts and roles.
- **Profile management** --- users can update their profile name and
  avatar.
- **Light and dark themes** --- the interface uses CSS variables
  defined in `globals.css`.
- **Responsive UI** --- dashboard navigation and data views adapt to
  different screen sizes.

---

## Technology Stack
### Core
- **Framework:** Next.js `16.3.6` (App Router)
- **UI Runtime:** React / React DOM `19.2.8`
- **Language:** TypeScript

### UI & Styling
- **UI Components:** Material UI `^9.4.0`
- **Styling Engine:** Emotion
- **Icons:** `lucide-react`

### Backend & Data
- **Authentication, Database & Storage:** Supabase
- **Email Service:** Resend
- **Rate Limiting:** Upstash Redis, `@upstash/ratelimit`

### Forms & Visualization
- **Form Handling & Validation:** Formik, Yup
- **Charts:** Recharts
- **QR Code Rendering:** `qrcode.react`
- **Image Cropping:** `react-easy-crop`
- **Spreadsheet Operations:** `xlsx`

### Development & Deployment
- **Linting & Formatting:** ESLint, Prettier
- **Deployment:** Vercel
---

## Requirements

Install a Node.js version compatible with the project's Next.js version
and the package manager used by the repository. The project manifest
lists npm scripts; use the lockfile present in the repository to select
the package manager and install command.

You will also need configured services and credentials for the features
you use:

- Supabase project (Auth, Database, and Storage)
- Resend account/API key for email notifications
- Upstash Redis credentials for rate limiting

Exact environment variable names must be confirmed from the current
source code or deployment configuration

---

## Getting Started

1.  Clone the repository:
    git clone https://github.com/tyedang-works/qr-feedback.git
    cd qr-feedback

2.  Install dependencies using the package manager indicated by the
    repository's lockfile. For npm, for example:
    npm install

3.  Configure local environment variables. Check the repository's
    `.env.local`, deployment settings, and source references for the
    exact required names. Do not guess variable names or commit secret
    values.

4.  Start the development server:
    npm run dev

5.  Open <http://localhost:3000>.

---

## Available Scripts

Run the following commands from the project root directory.

- `npm run dev` — Start the Next.js development server.
- `npm run build` — Create a production build.
- `npm run start` — Start the production server after building.
- `npm run lint` — Run ESLint to check for code issues.
- `npm run format` — Format files with Prettier.
- `npm run format:check` — Check code formatting with Prettier.

---

## Application Workflow

1.  A restaurant and its initial account are configured in the database.
2.  A customer scans the QR code assigned to a restaurant table.
3.  The customer submits feedback through the public feedback form.
4.  The application validates the submission and stores it in Supabase.
5.  A notification email is sent through Resend.
6.  Authorized restaurant users review and manage feedback in the
    dashboard.

---

## Roles and Access

The project defines these roles:

- **Owner (`OWNER`)** --- manages restaurant settings and user
  accounts.
- **Manager (`MANAGER`)** --- can manage tables.
- **Staff (`STAFF`)** --- can access and manage feedback.

Always inspect `src/lib/auth/permissions.ts` for the current source of truth
before changing authorization.

All authorization-sensitive server actions must verify the authenticated
user, permissions, submitted input, and restaurant ownership on the
server. Do not trust a client-supplied role, user ID, or restaurant ID.

---

## Multi-Tenant Architecture & Data Isolation

QR Feedback follows a multi-tenant architecture with the following rules:

- **One email, one restaurant:** Each email address can belong to only one restaurant.
- **One Owner, one restaurant:** Each Owner manages exactly one restaurant.
- **Restaurant context:** Reuse the existing `profiles.restaurant_id` relationship to determine the user's restaurant context.
- **No additional tenant mapping:** Do not introduce restaurant slugs or multi-restaurant membership.
- **Shared authentication:** All restaurants use the same login system and QR Feedback branding.
- **Context resolution:** After authentication, resolve the user's restaurant context through the existing `getUserContext()` flow.

### Security Considerations

These rules are essential for authorization and tenant data isolation. Before changing tenant-related behavior, verify the existing database constraints and Row Level Security (RLS) policies to ensure users can access only the data they are authorized to access.

---

## Styling and UI Conventions

- **Global styles:** Global styles and theme tokens are defined in `src/app/globals.css`.
- **Theme support:** Support both light and dark themes using `:root`, `:root[data-theme="light"]`, and `:root[data-theme="dark"]`.
- **CSS variables:** Prefer existing CSS variables for colors instead of introducing hardcoded colors or replacing project-defined CSS variables with MUI palette values.
- **Shared components and styles:** Reuse existing components and style utilities when their current exports and props match the use case:
  - Components: `QRTextField`, `QRSelect`, `QRDialog`, `QRSnackbar`, `TabBar`
  - Style utilities: `cardSx`, `buttonBaseSx`, `buttonBaseCancelSx`, `chipBaseSx`
- **Icons:** Use `lucide-react` to stay consistent with the existing UI convention.
- **MUI styling:** Place MUI System and layout properties inside the `sx` prop.
- **Responsive design:** Preserve existing responsive behavior, layouts, and working interactions unless a change explicitly requires otherwise.

---

## Supabase Client Safety

The project context identifies three Supabase client patterns:

- **Admin client** --- server-only; uses `SUPABASE_SECRET_KEY`.
- **Server client** --- uses `@supabase/ssr` and request cookies for
  authenticated server-side operations.
- **Browser client** --- uses `@supabase/ssr` with public
  configuration only.

Inspect the current files under `src/lib/supabase/` before changing
these patterns. Keep secrets in server-only environment variables and
enforce authorization on the server.

---

## Database and Storage

Supabase is used for authentication, database records, and file storage.
Known profile fields include `full_name`, `role`, `restaurant_id`, and
`avatar_url`.

Known storage buckets:

- `profile-avatars` --- user avatars.
- `restaurant-branding` --- restaurant logos and favicons.

---

## Deployment

The project has previously been deployed to Vercel. To deploy or update
production:

1.  Confirm the correct Git branch and deployment project.
2.  Configure all required environment variables in the deployment
    environment.
3.  Confirm Supabase Auth, database, RLS, storage, Resend, and Upstash
    configuration.
4.  Run lint and production build checks.
5.  Deploy and verify the main customer feedback flow and authenticated
    dashboard in the target environment.

---

## Development Guidelines

Before implementing a change:

1.  Read `AI_CONTEXT.md`.
2.  Inspect the current implementation and relevant imports.
3.  Verify actual component props, exports, routes, server actions, CSS
    variables, and database schema.
4.  Reuse existing patterns and keep changes scoped to the requested
    feature.
5.  Preserve existing behavior and layout unless the requirement
    explicitly calls for a change.

After implementing a change:

1.  Run `npm run lint` and `npm run build` when appropriate.
2.  Fix issues introduced by the change.
3.  Report which files and behaviors changed.
4.  State accurately whether lint, build, tests, and deployment were
    actually verified.
5.  Update `AI_CONTEXT.md` when architecture, conventions, or project
    status materially changes.

---

## Project Context

`AI_CONTEXT.md` is the companion reference for AI-assisted development.
It contains more detailed notes on project architecture, permission
rules, shared components, styling conventions, and implementation
caveats. Keep it aligned with the codebase as the project evolves.
