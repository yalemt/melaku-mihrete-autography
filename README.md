# A Life Between Three Flags — his memoir website

A website for your uncle's book: chapters to read online, a photo gallery
organized by country (Ethiopia / Germany / USA), his portfolio of places
worked and visited, a PDF download, and a guestbook anyone can write in.

**No coding needed after setup.** Once deployed, you and your brothers edit
everything — text, photos, chapters, guestbook messages — from a simple
`/admin` panel in the browser.

---

## 1. Put this on GitHub

1. Go to https://github.com/new and create a new **private or public**
   repository (e.g. `uncle-memoir`).
2. On your computer, open a terminal in this folder and run:

   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/uncle-memoir.git
   git push -u origin main
   ```

   (Replace `YOUR-USERNAME` with your GitHub username. If you don't have
   `git` installed, GitHub's website also lets you drag-and-drop upload all
   these files/folders directly through "Add file → Upload files".)

---

## 2. Deploy to Netlify

1. Go to https://app.netlify.com and sign up / log in (you can sign in with
   your GitHub account directly).
2. Click **"Add new site" → "Import an existing project"**.
3. Choose GitHub, then pick the `uncle-memoir` repository.
4. Build settings: leave **Build command empty** and **Publish directory**
   as `.` (this site needs no build step — it's already plain HTML/CSS/JS).
5. Click **Deploy**. In a minute you'll get a live URL like
   `https://random-name-123.netlify.app`.
6. Optional: in **Site settings → Domain management**, change the site name
   to something like `uncle-memoir.netlify.app`, or connect a domain you own.

---

## 3. Turn on editing (so you and your brothers can add/edit/delete content)

This site uses a free, built-in content editor (Decap CMS) so family can
add photos, chapters, and text without touching code. **Netlify's old
"Identity + Git Gateway" login system has been discontinued for new
sites** (you may have noticed there's no "Identity" option in your Netlify
dashboard anymore) — so instead this site is wired up to use
**DecapBridge**, a free service built specifically to replace it.

1. Go to https://decapbridge.com and sign up (free).
2. Create a new site in DecapBridge and connect it to your GitHub
   repository (`uncle-memoir`, or whatever you named it).
3. DecapBridge will give you two values: a **site ID** (used in an
   `identity_url`) and a **gateway URL**. Open `admin/config.yml` in your
   GitHub repo and edit the `backend` section at the top:

   ```yaml
   backend:
     name: git-gateway
     repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME
     branch: main
     identity_url: https://auth.decapbridge.com/sites/YOUR-DECAPBRIDGE-SITE-ID
     gateway_url: https://gateway.decapbridge.com
   ```

   Replace `YOUR-GITHUB-USERNAME/YOUR-REPO-NAME` with your actual repo
   (for example `yaye123/uncle-memoir`), and `YOUR-DECAPBRIDGE-SITE-ID`
   with the ID DecapBridge gives you. Commit the change.
4. In the DecapBridge dashboard, find **"Manage collaborators"** (or
   similar) and invite your brothers by email. They don't need a GitHub
   account — DecapBridge handles login on their behalf and pushes their
   changes to your repo under the hood.
5. Once invited, anyone can go to:

   ```
   https://YOUR-SITE-NAME.netlify.app/admin/
   ```

   log in with the email/password (or Google/Microsoft login, depending
   on what you chose in DecapBridge), and **edit, upload, delete, and
   insert**:
   - Site text (book title, tagline, home page quote, about-page biography)
   - Book chapters (add new ones, edit text, delete, reorder by number)
   - Photos (upload new ones, tag by country/category/year, delete)
   - Guestbook messages shown publicly on the guestbook page

Every save in `/admin` creates a commit in your GitHub repo and Netlify
automatically republishes the site within about a minute.

---

## 4. Add the real content

Right now every text field and photo is a clearly-labeled placeholder so
the site works immediately. Replace them whenever you're ready:

- **Book title / tagline / quote / biography** → edit via `/admin` → "Site text"
- **Chapters** → edit via `/admin` → "Book chapters" (one entry per chapter;
  set the country as Ethiopia / Germany / USA and a year range)
- **Photos** → edit via `/admin` → "Photo gallery" (upload the image right
  there, it's stored in the `/images` folder automatically)
- **The downloadable PDF** → upload the actual manuscript file into the
  `/book` folder in your GitHub repo (or via GitHub's web upload), name it
  `manuscript.pdf`, and it will just work — no other change needed. If you
  want a different filename, update the "Path to the downloadable PDF"
  field in `/admin` → "Site text".

---

## 5. The guestbook (visitors writing on the page)

Anyone who visits `guestbook.html` can submit a message — no login
required. Submissions arrive in your **Netlify dashboard → your site →
Forms → guestbook**, so the family can read every message and filter spam
before anything goes public.

To make a message appear publicly on the guestbook page, copy it into
`/admin` → "Guestbook (public messages)" → add a new entry with the
person's name and message.

---

## 6. Get it indexed on Google

1. Go to https://search.google.com/search-console and add your site
   (use the Netlify URL, or your custom domain if you connected one).
2. Verify ownership using the **HTML tag** method (Google gives you a
   `<meta>` tag — paste it into the `<head>` of `index.html`, commit, push,
   and click Verify), or the **domain/DNS** method if you own a custom domain.
3. Once verified, open **Sitemaps** in the left menu and submit:
   `https://YOUR-SITE-NAME.netlify.app/sitemap.xml`
   (first edit `sitemap.xml` and `robots.txt` in the repo, replacing
   `YOUR-SITE-NAME` with your actual Netlify subdomain or custom domain).
4. Use **URL Inspection → Request Indexing** on the home page to speed
   things up. Full indexing can still take anywhere from a few days to a
   couple of weeks.

---

## What's in this folder

```
index.html        Home page
book.html          Chapter list + on-page reader
gallery.html       Filterable photo gallery + lightbox
about.html         Biography + portfolio-by-country
guestbook.html      Public message form + approved messages
style.css          All site styling
js/main.js          Loads content from /data and renders every page
data/site.json      Book title, tagline, quote, biography, PDF path
data/chapters.json  All book chapters
data/photos.json    All gallery photos
data/guestbook.json  Approved public guestbook messages
images/             Uploaded photos land here
book/               Put manuscript.pdf here
admin/              The Decap CMS editor (config.yml + index.html)
netlify.toml         Netlify build settings (no build step needed)
sitemap.xml, robots.txt   For Google indexing
```

No React, no build tools, no database — just files, edited either directly
in GitHub or through the `/admin` panel once Identity + Git Gateway are on.
