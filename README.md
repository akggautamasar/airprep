# AirPrep

A Vercel-hosted portal for standalone interactive HTML lessons and mock tests.

## Setup

1. Deploy this Next.js repository to Vercel.
2. Create a **public Vercel Blob** store connected to the project.
3. Set environment variable `AIRPREP_ADMIN_PASSWORD` to a strong secret (the initial requested password is `airadmin`, but change it after first use).
4. Open `/admin`, sign in, and upload HTML files. Each uploaded resource appears on the landing page, without redeploying.

Large uploads use browser-to-Vercel-Blob client uploads (up to 25 MB/file). Content is hosted publicly on the Blob domain; only upload trusted HTML. HTML can execute JavaScript and may load external scripts. Keep sensitive information out of uploaded resources. Files should be self-contained or use public assets. Uploaded documents open inside a sandboxed viewer. Client-side bookmarks are stored locally in the user's browser.

## Security

Admin authentication uses a signed HttpOnly SameSite cookie; the password is checked server-side. This is a single-admin mechanism, not multi-user identity management. For a production-facing installation replace the shared password with a stronger unique password. The admin password must be configured as a Vercel environment variable; the application does not contain a hardcoded fallback.
