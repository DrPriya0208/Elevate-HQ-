# ElevateHQ website

Next.js 15 (App Router) + TypeScript + Tailwind, Prisma + Postgres (Neon free tier), Auth.js single-admin login, Tiptap blog editor.

## 1. Set up locally

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

1. **Database:** create a free project at https://neon.tech, open **Connect**, and copy
   - the *pooled* connection string into `DATABASE_URL`
   - the *direct* (non-pooled) string into `DIRECT_URL`
2. **Auth secret:** `openssl rand -base64 32` → `AUTH_SECRET`
3. **Admin login:** set `ADMIN_EMAIL`, then run
   `npm run hash -- "your-strong-password"` and paste the output line into `.env`

Create the tables and start the app:

```bash
npx prisma migrate dev --name init
npm run dev
```

## 2. Verify it works

| Check | Command / action | Expected |
|---|---|---|
| Types compile | `npm run typecheck` | no errors |
| Site loads | `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000` | `200` |
| Admin is protected | `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/admin` | `307` and a URL ending in `/admin/login` |
| Wrong password | sign in at `/admin/login` with a bad password | "Email or password is incorrect." |
| Right password | sign in with your `.env` credentials | lands on `/admin` |
| Draft stays hidden | create a post with *Published* unticked, then `curl -s http://localhost:3000/blog \| grep -c "YOUR POST TITLE"` | `0` |
| Publish works | edit the post, tick *Published*, wait a moment (or restart `npm run dev`), run the same curl | `1` or more |
| Contact form saves | submit `/contact` | "Message received", and the enquiry shows on `/admin` |
| DB has the data | `npm run db:studio` | `Post` and `Enquiry` rows visible |

## 3. Deploy (Vercel free tier)

1. Push the repo to GitHub (commit the `prisma/migrations` folder).
2. Import it in Vercel and add every variable from `.env` (set `NEXT_PUBLIC_SITE_URL` to `https://elevatehq.in`).
3. Set the **Build Command** to `npx prisma migrate deploy && next build`.
4. Add the domain `elevatehq.in` in Vercel and follow the DNS instructions.

## 4. Before launch

- Replace the placeholder services, FAQ answers, and `qualifications` in `lib/content.ts`.
- Contact email: Resend's test sender only delivers to your own Resend account email. Verify `elevatehq.in` in Resend, then set `CONTACT_FROM_EMAIL` (for example `ElevateHQ <hello@elevatehq.in>`) and `CONTACT_TO_EMAIL`.
- The business card prints `elevatehq.com`. Make sure the card, QR code, and email addresses match the domain you actually use.

## Not included yet

- Image uploads in blog posts (cover images use a link for now; Vercel Blob or Cloudinary is the next step)
- Login attempt rate limiting
- Online appointment booking
