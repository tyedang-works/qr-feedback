# QR Feedback — AI Context

## 1. Project Overview

QR Feedback is a restaurant customer feedback management system.

Main workflow:

- Customers scan a table QR code.
- Customers submit feedback through a form.
- Feedback is stored in Supabase.
- Restaurant staff review and manage feedback in the dashboard.

## 2. Tech Stack

- Next.js App Router
- React
- TypeScript
- Material UI (MUI)
- Supabase (Auth, Database, Storage)
- Formik and Yup for form validation
- Resend for email notifications
- Vercel for deployment

Check `package.json` for the exact installed versions.

## 3. Code Conventions

- Use TypeScript.
- Prefer reusing existing components, helpers, styles, and server actions.
- Do not invent component props, APIs, or file paths.
- Inspect the existing implementation before refactoring.
- Provide complete files when implementing requested changes.
- Keep changes scoped to the requested feature.
- Do not rewrite working logic unnecessarily.

### Forms

- Use `<Formik>` with render props.
- Do not use the `useFormik` hook.
- Use Yup for form validation where appropriate.
- Reuse `QRTextField` and other existing form components.
- `QRTextField` uses the `errorMessage` prop for validation errors.

### UI and Styling

- Reuse `cardSx` from the existing card styles.
- Reuse `buttonBaseSx` and other shared button styles.
- Prefer existing CSS variables for colors to support dark mode.
- Avoid hardcoded colors when an existing theme variable is suitable.
- Use Font Awesome only if the project requirement specifies it;
  otherwise inspect existing icon conventions before adding icons.
- Keep UI responsive.

## 4. Authentication and Roles

Current roles:

- Owner
- Manager
- Staff

Important permission rules:

- Owner can manage restaurant settings and users.
- Owner and Manager can manage tables.
- Owner and Staff can access and manage feedback.
- QR code access follows the existing `canViewQRCodes` permission.

Always inspect `src/lib/auth/permissions.ts` before changing authorization.

Server actions must validate authentication, permissions,
input data, and restaurant ownership on the server.

## 5. Shared Components and Styles

Reuse existing components where applicable:

- `QRTextField`
- `QRSelect`
- `QRDialog`
- `QRSnackbar`
- `TabBar`

Shared styles:

- `cardSx`
- `buttonBaseSx`
- `buttonBaseCancelSx`
- `chipBaseSx`

Verify actual exports and paths in the repository before importing.

## 6. Profile Feature

Current implementation:

- Profile page route: `/dashboard/profile`
- Profile UI: `src/components/profile/ProfilePage.tsx`
- Profile server actions: `src/app/dashboard/profile/actions.ts`
- Profile fields: full name, email, role, avatar.
- Email and role are read-only.
- Full name and avatar can be updated.
- Avatar files use the Supabase Storage bucket `profile-avatars`.
- Accepted avatar formats: PNG, JPEG, WebP.
- Maximum avatar size: 1 MB.
- Avatar upload is handled by a server action.
- Profile form uses Formik render props and Yup.
- Avatar selection uses a hover overlay labelled "Update photo".

### Current Next Task: Avatar Cropping

- Reuse the existing `react-easy-crop` implementation from Branding.
- Inspect the existing crop dialog and `createCroppedFile` helper first.
- Use a 1:1 crop for profile avatars.
- Update the preview only after the user confirms the crop.
- Upload only when the user clicks Save.
- Canceling the crop must preserve the previously selected avatar preview.
- Revoke temporary object URLs to avoid memory leaks.
- Keep server-side MIME type and file size validation.

## 7. Branding Feature

- Restaurant logo and favicon are managed in Settings.
- Storage bucket: `restaurant-branding`.
- Branding uploads are handled by server actions.
- Reuse the existing crop implementation instead of duplicating it.
- Default favicon path: `/assets/favicon.ico`.

Inspect the current Branding implementation before modifying it.

## 8. Database and Storage

- Supabase is used for authentication, database, and file storage.
- `profiles` includes `full_name`, `role`, `restaurant_id`, and `avatar_url`.
- `restaurants` stores restaurant settings and branding URLs.
- The `profile-avatars` bucket stores user avatars.
- The `restaurant-branding` bucket stores restaurant logos and favicons.

Verify current database schema and storage policies before making
database or storage changes.

## 9. Workflow for AI-Assisted Changes

Before implementing a task:

1. Read this file.
2. Inspect the relevant source files.
3. Confirm the existing APIs, props, exports, and server actions.
4. Reuse existing patterns where possible.
5. Implement only the requested scope.

After implementing:

1. Run lint and build when appropriate.
2. Fix errors introduced by the changes.
3. Summarize changed files and behavior.
4. Update this context file when architecture, conventions,
   completed tasks, or next steps materially change.

Never claim lint or build passed unless it was actually verified.
