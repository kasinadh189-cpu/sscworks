# Sofa shop website

Next.js 15 + React 19 + Tailwind v4 + Motion. English and Malayalam. No logins, no prices, WhatsApp enquiries.
Works out of the box with sample products. Connect the admin when you're ready.

## 1. Run it locally
```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

## 2. Put in your details
Open `lib/config.ts` and change: shop name, city, address, WhatsApp number (already set to +91 81130 10439).
Logo: replace the text in `components/Header.tsx` with an `<Image>` of your logo (put the file in `/public`).
Colours are in `app/globals.css` under `@theme`.

## 3. Admin portal at /admin (only you)
1. Create a free project at https://www.sanity.io/manage, dataset `production`.
2. Copy the Project ID into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. In the Sanity dashboard go to API > CORS origins and add `http://localhost:3000` and your live domain, with "Allow credentials" on.
4. Open `/admin`, sign in with your Google/email. Only people you invite under Members can edit.
5. Click "Sofa model" > Create. Fill in the tabs: Basics, Photos, Size and build, Colours and custom, Delivery and care, Show / hide. Add as many models as you like; they appear on the site (and in search and filters) within about a minute. Set Badge to Bestseller to feature one, or tick "Hide from website" to remove it.
6. Once Sanity is connected, the sample sofas disappear and only your models show.

## 4. Go live
Push to GitHub, import on https://vercel.com, add the same environment variables (set `NEXT_PUBLIC_SITE_URL` to your real domain), deploy.

## 5. Show up on Google
- Submit `https://yourdomain.com/sitemap.xml` in Google Search Console.
- Create a free Google Business Profile for the shop (this is what drives "furniture shop near me").
- Each Kerala district has its own page at `/en/delivery/<district>` and `/ml/delivery/<district>`.

WhatsApp messages are written in English so you can read them easily; the customer's chosen language only changes the site.
