/* ============================================
   A Life Between Three Flags — site script
   Reads content from /data/*.json so the whole
   site can be edited without touching code.
   ============================================ */

async function loadJSON(path) {
  const res = await fetch(path + "?v=" + Date.now());
  if (!res.ok) throw new Error("Could not load " + path);
  return res.json();
}

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/* ---------- Site-wide text (hero, about, nav brand) ---------- */
async function applySiteText() {
  try {
    const site = await loadJSON("data/site.json");
    document.querySelectorAll("[data-field]").forEach((node) => {
      const key = node.getAttribute("data-field");
      if (site[key] !== undefined) node.textContent = site[key];
    });
    const dl = document.querySelector("[data-download]");
    if (dl && site.download_pdf) dl.setAttribute("href", site.download_pdf);
    document.title = document.title.replace("{{book_title}}", site.book_title || "");
  } catch (e) { console.warn(e); }
}

/* ---------- Chapters (book.html) ---------- */
async function renderChapters() {
  const list = document.getElementById("chapter-list");
  if (!list) return;
  try {
    const data = await loadJSON("data/chapters.json");
    const chapters = data.chapters;
    chapters.sort((a, b) => a.order - b.order);
    chapters.forEach((ch) => {
      const row = el("div", "chapter-row");
      row.innerHTML = `
        <span class="num">${String(ch.order).padStart(2, "0")}</span>
        <span class="chapter-title">${ch.title}</span>
        <span class="country-tag">${ch.country} · ${ch.years}</span>
      `;
      row.addEventListener("click", () => openReader(ch));
      list.appendChild(row);
    });
  } catch (e) { console.warn(e); }
}

function openReader(ch) {
  const reader = document.getElementById("reader");
  document.getElementById("reader-title").textContent = ch.title;
  document.getElementById("reader-meta").textContent = `${ch.country} · ${ch.years}`;
  document.getElementById("reader-body").textContent = ch.text;
  reader.classList.add("open");
  reader.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeReader() {
  document.getElementById("reader").classList.remove("open");
}

/* ---------- Gallery (gallery.html) ---------- */
let allPhotos = [];

async function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  try {
    const photoData = await loadJSON("data/photos.json");
    allPhotos = photoData.photos;
    buildFilters(allPhotos);
    drawPhotos(allPhotos);
  } catch (e) { console.warn(e); }
}

function buildFilters(photos) {
  const bar = document.getElementById("filters");
  if (!bar) return;
  const countries = ["All", ...new Set(photos.map((p) => p.country))];
  countries.forEach((c) => {
    const btn = el("button", "filter-btn" + (c === "All" ? " active" : ""), c);
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      drawPhotos(c === "All" ? allPhotos : allPhotos.filter((p) => p.country === c));
    });
    bar.appendChild(btn);
  });
}

function drawPhotos(photos) {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = "";
  photos.forEach((p) => {
    const card = el("div", "photo-card");
    card.innerHTML = `
      <img src="${p.src}" alt="${p.caption}" loading="lazy">
      <div class="meta">
        <div class="cap">${p.caption}</div>
        <div class="tag">${p.country} · ${p.category} · ${p.year}</div>
      </div>
    `;
    card.addEventListener("click", () => openLightbox(p));
    grid.appendChild(card);
  });
}

function openLightbox(p) {
  const lb = document.getElementById("lightbox");
  document.getElementById("lightbox-img").src = p.src;
  document.getElementById("lightbox-img").alt = p.caption;
  document.getElementById("lightbox-cap").textContent = `${p.caption} — ${p.country}, ${p.year}`;
  lb.classList.add("open");
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}

/* ---------- Portfolio (about.html) ---------- */
async function renderPortfolio() {
  const wrap = document.getElementById("portfolio-cards");
  if (!wrap) return;
  try {
    const data = await loadJSON("data/chapters.json");
    const chapters = data.chapters;
    const byCountry = {};
    chapters.forEach((ch) => {
      if (!byCountry[ch.country]) byCountry[ch.country] = { years: [], count: 0 };
      byCountry[ch.country].years.push(ch.years);
      byCountry[ch.country].count++;
    });
    Object.entries(byCountry).forEach(([country, info]) => {
      const card = el("div", "portfolio-card");
      card.innerHTML = `
        <p class="country">${country}</p>
        <p class="years">${info.years.join(" · ")}</p>
        <p>${info.count} chapter${info.count > 1 ? "s" : ""} set here</p>
      `;
      wrap.appendChild(card);
    });
  } catch (e) { console.warn(e); }
}

/* ---------- Guestbook display (guestbook.html) ---------- */
async function renderGuestbook() {
  const wrap = document.getElementById("guestbook-entries");
  if (!wrap) return;
  try {
    const data = await loadJSON("data/guestbook.json");
    const entries = data.guestbook;
    entries.forEach((entry) => {
      const div = el("div", "entry");
      div.innerHTML = `<div class="who">${entry.name}</div><p class="msg">${entry.message}</p>`;
      wrap.appendChild(div);
    });
  } catch (e) { console.warn(e); }
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applySiteText();
  renderChapters();
  renderGallery();
  renderPortfolio();
  renderGuestbook();

  const closeReaderBtn = document.getElementById("close-reader");
  if (closeReaderBtn) closeReaderBtn.addEventListener("click", closeReader);

  const lb = document.getElementById("lightbox");
  if (lb) {
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  }
});
