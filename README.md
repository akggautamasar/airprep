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


## Responsive reading and Pretext

AirPrep uses the MIT-licensed [chenglou/pretext](https://github.com/chenglou/pretext) text-layout library (`@chenglou/pretext@1.0.0`) **only for browser UI text measurement**:

- `components/PretextTitle.jsx` measures card and reader-header titles with `prepare()` and `layout()`. It caches prepared text, recomputes on `ResizeObserver` width updates, and uses responsive CSS as a fallback.
- `app/page.jsx` exposes **Bookmarked**, **Recently opened**, and the `Aa` button for three reading sizes. Favorites, recent lessons and text size are browser-local.
- `app/globals.css` provides fluid cards, safe minimum widths, responsive admin forms and touch-friendly controls.
- `app/api/view/route.js` streams the original HTML into a sandboxed viewer with a responsive CSS/JS layer. **MathJax remains responsible for math.** Display equations that cannot fit are scaled a little and then scroll horizontally in an accessible equation area. Tables and wide diagrams remain navigable.

Pretext is **not** a drop-in replacement for CSS, MathJax or [PreTeXt](https://github.com/PreTeXtBook/pretext), the unrelated XML textbook publishing system. Existing interactive HTML documents are **not rewritten** or converted to PreTeXt. Files uploaded through Admin receive the same viewer adapter without an extra deployment.

The `Aa` reader-size control styles known lecture markup (`.sec-body`, `.card-summary` and common article text). Custom uploaded HTML with other markup may need its own CSS; no global override can guarantee correct presentation for every arbitrary document.

## Responsive verification checklist

Test at 320px, 360px, 390px, 768px and 1280px (and in landscape orientation):

1. No page-wide horizontal overflow. Long course titles should wrap or truncate gracefully.
2. Special Purpose Machines L5: both forward- and backward-slip equations must be readable. For very long expressions, swipe the **equation itself** to view the right-hand side.
3. Search, filters, bookmarks and **Recently opened** should all function without page reloads.
4. `Aa` cycles normal → large → extra → normal. It persists when the page is reopened in the same browser.
5. Interactive simulators and mock tests must retain their original buttons, questions, scripts and diagrams.
6. On small screens, the lecture navigation collapses to a toggle; on desktop the sidebar remains visible.
7. Admin must remain usable on a phone. Upload HTML only from trusted sources.

Vercel deployments verify that the app compiles, but real-device testing remains useful because user-uploaded HTML can contain arbitrary fixed-width elements and third-party libraries.
