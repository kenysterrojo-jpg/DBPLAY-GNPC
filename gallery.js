/* ===== DB PLAY — gallery.js (DonBelle edition) ===== */

/* ---------- 10 DonBelle photos ----------
   Make a folder called "PHOTOS-IMAGE" next to gallery.html and put your pictures
   inside using these exact names. Until a file exists, a placeholder is shown. */
const photos = [
  { src: "PHOTOS-IMAGE/DONBELLE-TAYO-BTS.png", title: "BTS of Tayo Sa Wakas", place: "Behind the Scenes", tagline: "Kilig, off-cam and on-cam.",
    caption: "A peek behind the cameras of Tayo Sa Wakas, where Donny and Belle share laughs between takes before the next scene begins." },
  { src: "PHOTOS-IMAGE/DONBELLE-ASAP.png", title: "ASAP Natin 'To", place: "ASAP", tagline: "Same stage, same sparkle.",
    caption: "DonBelle on the ASAP stage, performing together while the crowd goes wild." },
  { src: "PHOTOS-IMAGE/DONBELLE-HEI.png", title: "He's Into Her", place: "Series", tagline: "Where it all started for us.",
    caption: "The story that made so many fall for Donny and Belle as a love team. One of the most-loved moments from He's Into Her." },
  { src: "PHOTOS-IMAGE/DONBELLECBML.png", title: "Can't Buy Me Love", place: "Movie", tagline: "From the series to the big screen.",
    caption: "DonBelle on the big screen in Can't Buy Me Love, bringing the kilig to cinemas." },
  { src: "PHOTOS-IMAGE/DONBELLE-PRESSCON.png", title: "Press Con Day", place: "Media Day", tagline: "Sweet answers, sweeter smiles.",
    caption: "Questions, cameras and lots of teasing as Donny and Belle face the media together." },
  { src: "PHOTOS-IMAGE/DONBELLE-FANMEET.png", title: "Fan Meet", place: "Fan Event", tagline: "Thank you, DonBelle fans!",
    caption: "A special day with the fans who have supported DonBelle from the very beginning. Screams, signs and so much love." },
  { src: "PHOTOS-IMAGE/DONBELLE-PHOTOSHOOT.png", title: "Magazine Shoot", place: "Photoshoot", tagline: "Picture perfect together.",
    caption: "Soft lights, perfect poses and that chemistry that no camera can miss. A DonBelle photoshoot to remember." },
  { src: "PHOTOS-IMAGE/DONBELLE-REDCARPET.png", title: "Red Carpet Moment", place: "Premiere", tagline: "Arriving side by side.",
    caption: "Donny and Belle on the red carpet, dressed to impress and smiling for the flashing cameras." },
  { src: "PHOTOS-IMAGE/DONBELLE-KULITAN.png", title: "Kulitan Time", place: "On Set", tagline: "Tawanan muna bago take.",
    caption: "A candid, funny moment between takes. Proof that the DonBelle chemistry is real, on and off screen." },
  { src: "PHOTOS-IMAGE/DONBELLE-TOGETHER.png", title: "DonBelle Forever", place: "Our Favorite", tagline: "Thank you for the kilig.",
    caption: "Donny and Belle together, the photo that sums it all up. Thank you to every DonBelle fan for the love." }
];

const N = photos.length;
const pad = n => String(n).padStart(2, "0");
const $ = id => document.getElementById(id);

/* ---------- placeholder art (used if a photo file is missing) ---------- */
function placeholder(i) {
  const h = (i * 37 + 190) % 360;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120">` +
    `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="hsl(${h},65%,58%)"/>` +
    `<stop offset=".65" stop-color="hsl(${(h + 35) % 360},55%,70%)"/></linearGradient></defs>` +
    `<rect width="800" height="1120" fill="url(#s)"/>` +
    `<circle cx="${180 + (i % 5) * 110}" cy="260" r="70" fill="rgba(255,255,255,.55)"/>` +
    `<path d="M0 760 L170 520 L300 680 L470 430 L640 650 L800 540 V1120 H0Z" fill="hsl(${h},35%,32%)"/>` +
    `<path d="M0 880 L220 690 L380 820 L560 640 L800 830 V1120 H0Z" fill="hsl(${h},30%,20%)"/>` +
    `<path d="M0 1000 L260 880 L520 980 L800 900 V1120 H0Z" fill="hsl(${h},28%,12%)"/>` +
    `</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function makeImg(i, alt) {
  const img = new Image();
  img.alt = alt || "";
  img.draggable = false;
  img.onerror = () => { img.onerror = null; img.src = placeholder(i); };
  img.src = photos[i].src;
  return img;
}

/* ---------- carousel ---------- */
const slidesEl = $("slides");
const dotsEl = $("dots");
let current = 0;
let suppressClick = false;

const slideEls = photos.map((p, i) => {
  const slide = document.createElement("button");
  slide.type = "button";
  slide.className = "slide";
  slide.setAttribute("aria-label", `${p.title}, ${p.place}`);
  slide.appendChild(makeImg(i, p.title));

  const cap = document.createElement("div");
  cap.className = "cap";
  cap.innerHTML = `<strong></strong><span class="place"></span><em></em>`;
  cap.querySelector("strong").textContent = p.title;
  cap.querySelector(".place").textContent = p.place;
  cap.querySelector("em").textContent = p.tagline;
  slide.appendChild(cap);

  slide.addEventListener("click", () => {
    if (suppressClick) return;
    if (i === current) openLightbox(i);
    else goTo(i);
  });
  slidesEl.appendChild(slide);
  return slide;
});

const dotEls = photos.map((p, i) => {
  const d = document.createElement("button");
  d.type = "button";
  d.setAttribute("role", "tab");
  d.setAttribute("aria-label", `Photo ${i + 1}: ${p.title}`);
  d.addEventListener("click", () => goTo(i));
  dotsEl.appendChild(d);
  return d;
});

function render() {
  slideEls.forEach((el, i) => {
    let d = (i - current + N) % N;
    if (d > N / 2) d -= N;
    const pos = d === 0 ? "0" : Math.abs(d) === 1 ? "near" : "far";
    el.style.setProperty("--o", Math.max(-2, Math.min(2, d)));
    el.dataset.pos = pos;
    el.tabIndex = pos === "far" ? -1 : 0;
    el.setAttribute("aria-hidden", pos === "far" ? "true" : "false");
  });
  dotEls.forEach((d, i) => d.setAttribute("aria-selected", i === current ? "true" : "false"));
  $("counter").textContent = `${pad(current + 1)} / ${pad(N)}`;
}

function goTo(i) { current = (i + N) % N; render(); }
const next = () => goTo(current + 1);
const prev = () => goTo(current - 1);

$("nextBtn").addEventListener("click", next);
$("prevBtn").addEventListener("click", prev);

/* swipe / drag */
const carousel = $("carousel");
let startX = null;
carousel.addEventListener("pointerdown", e => {
  if (e.target.closest(".nav-btn")) return;
  startX = e.clientX;
});
carousel.addEventListener("pointerup", e => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  startX = null;
  if (Math.abs(dx) > 50) {
    dx < 0 ? next() : prev();
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 0);
  }
});
carousel.addEventListener("pointercancel", () => (startX = null));

/* ---------- lightbox ---------- */
const lb = $("lightbox");
let lbIndex = 0;
let lastFocus = null;

function renderLightbox() {
  const p = photos[lbIndex];
  const img = $("lbImg");
  img.onerror = () => { img.onerror = null; img.src = placeholder(lbIndex); };
  img.src = p.src;
  img.alt = p.title;

  $("lbCount").textContent = `${pad(lbIndex + 1)} / ${pad(N)}`;
  $("lbTitle").textContent = p.title;
  $("lbSub").textContent = `${p.place} — ${p.tagline}`;
  $("lbCaption").textContent = p.caption;

  // 4 more photos: the next four after this one
  const thumbs = $("lbThumbs");
  thumbs.innerHTML = "";
  for (let k = 1; k <= 4; k++) {
    const idx = (lbIndex + k) % N;
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `View ${photos[idx].title}`);
    b.appendChild(makeImg(idx, photos[idx].title));
    b.addEventListener("click", () => { lbIndex = idx; current = idx; render(); renderLightbox(); });
    thumbs.appendChild(b);
  }
}

function openLightbox(i) {
  lbIndex = i;
  lastFocus = document.activeElement;
  renderLightbox();
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  $("lbClose").focus();
}

function closeLightbox() {
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (lastFocus) lastFocus.focus();
}

function lbStep(dir) {
  lbIndex = (lbIndex + dir + N) % N;
  current = lbIndex;
  render();
  renderLightbox();
}

$("lbClose").addEventListener("click", closeLightbox);
$("lbNext").addEventListener("click", () => lbStep(1));
$("lbPrev").addEventListener("click", () => lbStep(-1));
lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });

/* ---------- header: menu, search, sign out ---------- */
const menuBtn = $("menuBtn");
const menuPanel = $("menuPanel");

function setMenu(open) {
  menuPanel.classList.toggle("active", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuBtn.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
}

menuBtn.addEventListener("click", e => {
  e.stopPropagation();
  setMenu(!menuPanel.classList.contains("active"));
});
menuPanel.addEventListener("click", e => e.stopPropagation());
document.addEventListener("click", () => setMenu(false));

$("signOut").addEventListener("click", () => {
  try { localStorage.removeItem("dbplay-user"); sessionStorage.clear(); } catch (err) { /* ignore */ }
  // then the link goes to login1.html
});

const searchForm = $("searchForm");
const searchInput = $("searchInput");
const searchIcon = $("searchIcon");

function setSearch(open) {
  searchInput.classList.toggle("active", open);
  if (open) searchInput.focus();
  else { searchInput.value = ""; searchInput.removeAttribute("aria-invalid"); }
}

searchIcon.addEventListener("click", () => setSearch(!searchInput.classList.contains("active")));
searchIcon.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSearch(!searchInput.classList.contains("active")); }
});
searchInput.addEventListener("input", () => searchInput.removeAttribute("aria-invalid"));
searchForm.addEventListener("submit", e => {
  e.preventDefault();
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;
  const hit = photos.findIndex(p =>
    [p.title, p.place, p.tagline, p.caption].join(" ").toLowerCase().includes(q));
  if (hit === -1) searchInput.setAttribute("aria-invalid", "true");
  else goTo(hit);
});

/* ---------- keyboard ---------- */
document.addEventListener("keydown", e => {
  const lbOpen = lb.classList.contains("open");

  if (e.key === "Escape") {
    if (lbOpen) closeLightbox();
    else { setMenu(false); if (searchInput.classList.contains("active")) setSearch(false); }
    return;
  }

  if (lbOpen) {
    if (e.key === "ArrowRight") lbStep(1);
    if (e.key === "ArrowLeft") lbStep(-1);
    if (e.key === "Tab") {                       // keep focus inside the lightbox
      const f = [...lb.querySelectorAll("button")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    return;
  }

  if (document.activeElement === searchInput) return;
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});

render();