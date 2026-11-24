/* CINEVERSE — app.js — Mikey 2026 */
(function () {
'use strict';

const D = window.CV;
const SA = D.shoofAflam;

/* ═══════════════════ STATE ═══════════════════ */
const state = {
  lang: localStorage.getItem('cv_lang') || 'en',
  cart: JSON.parse(localStorage.getItem('cv_cart') || '[]'),
  watchlist: JSON.parse(localStorage.getItem('cv_watchlist') || '[]'),
  bookings: JSON.parse(localStorage.getItem('cv_bookings') || '[]')
};
let apiMoviesCache = [];
let currentAnimationFrame = null;

/* ═══════════════════ HELPERS ═══════════════════ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const t = (k) => (D.translations[state.lang] && D.translations[state.lang][k]) || D.translations.en[k] || k;
const money = (n) => `EGP ${Number(n).toLocaleString('en-US')}`;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function saveCart(){ localStorage.setItem('cv_cart', JSON.stringify(state.cart)); }
function saveWatchlist(){ localStorage.setItem('cv_watchlist', JSON.stringify(state.watchlist)); }
function saveBookings(){ localStorage.setItem('cv_bookings', JSON.stringify(state.bookings)); }

function toast(msg, type = ''){
  const el = $('#toast'); if (!el) return;
  el.textContent = msg; el.className = 'toast show ' + type;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2600);
}

function openModal(html){
  $('#modalPanel').innerHTML = html;
  $('#modal').classList.add('open');
  $('#modal').setAttribute('aria-hidden', 'false');
}
function closeModal(){
  $('#modal').classList.remove('open');
  $('#modal').setAttribute('aria-hidden', 'true');
}

/* ═══════════════════ CART ═══════════════════ */
function addToCart(item){
  state.cart.push(item); saveCart(); updateCartUI();
  toast('Added to cart', 'success');
}
function removeFromCart(i){
  state.cart.splice(i, 1); saveCart(); updateCartUI();
}
function cartTotal(){ return state.cart.reduce((s, i) => s + (i.total || 0), 0); }

function updateCartUI(){
  const c = $('#cartCount');
  if (c){ c.textContent = state.cart.length; c.classList.toggle('show', state.cart.length > 0); }
  renderCartDrawer();
}

function renderCartDrawer(){
  const wrap = $('#cartItems'); if (!wrap) return;
  if (state.cart.length === 0){
    wrap.innerHTML = `<div class="empty-cart">${esc(t('empty_cart'))}</div>`;
  } else {
    wrap.innerHTML = state.cart.map((item, i) => `
      <div style="display:flex;gap:.75rem;padding:.85rem 0;border-bottom:1px solid var(--border-soft)">
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:.9rem">${esc(item.name)}</div>
          <div style="font-size:.75rem;color:var(--muted);margin-top:.2rem">${esc(item.detail || '')}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="color:var(--gold);font-weight:700">${money(item.total)}</div>
          <button data-remove="${i}" style="font-size:.72rem;color:var(--muted);margin-top:.3rem">${esc(t('remove'))}</button>
        </div>
      </div>`).join('');
    wrap.querySelectorAll('[data-remove]').forEach(b => {
      b.addEventListener('click', () => removeFromCart(+b.dataset.remove));
    });
  }
  const tot = $('#cartTotal'); if (tot) tot.textContent = money(cartTotal());
}

function toggleCart(open){
  $('#cartDrawer').classList.toggle('open', open);
  $('#cartDrawer').setAttribute('aria-hidden', open ? 'false' : 'true');
  $('#drawerBackdrop').classList.toggle('open', open);
}

/* ═══════════════════ LANGUAGE ═══════════════════ */
function setLang(lang){
  state.lang = lang; localStorage.setItem('cv_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const ll = $('#langLabel'); if (ll) ll.textContent = lang.toUpperCase();
  route();
}

/* ═══════════════════ SHOOF AFLAM API ═══════════════════ */
async function fetchShoofAflamTitles(){
  const urls = [
    SA.titlesUrl,
    'https://api.allorigins.win/raw?url=' + encodeURIComponent(SA.titlesUrl),
    'https://corsproxy.io/?' + encodeURIComponent(SA.titlesUrl)
  ];
  for (const url of urls){
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) continue;
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e){
      console.warn('Shoof Aflam fetch failed:', e.message);
    }
  }
  return null;
}

function posterUrl(path){
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return SA.posterBase + path;
}

function movieFromSA(item){
  if (!item || item.type !== 'movie') return null;
  const year = item.year || null;
  return {
    id: 'sa-' + (item.slug || Math.random().toString(36).slice(2, 9)),
    titleEn: item.title_en || item.title_ar || item.slug || 'Untitled',
    titleAr: item.title_ar || item.title_en || item.slug || 'بدون عنوان',
    year: year,
    genres: item.genre ? [item.genre] : [],
    runtime: null,
    language: 'Arabic',
    subtitles: [],
    releaseDate: year ? `${year}-01-01` : null,
    status: 'archive',
    cast: [],
    country: 'Egypt',
    classification: null,
    rating: item.rating || item.vote_average || null,
    synopsisEn: `${item.genre || 'Arabic'} film from ${year || 'unknown year'}.`,
    synopsisAr: `${item.genre || 'فيلم'} ${year ? 'من ' + year : ''}.`,
    poster: posterUrl(item.poster_path),
    backdrop: posterUrl(item.poster_path),
    trailerUrl: null,
    featured: false,
    sources: ['shoofaflam'],
    _fromAPI: true
  };
}

async function getLatestMovies(limit = 12){
  const raw = await fetchShoofAflamTitles();
  if (!raw) return null;
  const movies = raw
    .filter(x => x.type === 'movie')
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, limit)
    .map(movieFromSA)
    .filter(Boolean);
  apiMoviesCache = movies;
  return movies;
}

/* ═══════════════════ ROUTER ═══════════════════ */
function route(){
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  const view = parts[0] || 'home';
  const app = $('#app'); if (!app) return;
  
  if (currentAnimationFrame) {
    cancelAnimationFrame(currentAnimationFrame);
    currentAnimationFrame = null;
  }

  app.innerHTML = '';

  try {
    switch (view){
      case 'home': renderHome(app); break;
      case 'movies': renderMoviesList(app); break;
      case 'now-showing': renderMoviesList(app, { status: 'now_showing' }); break;
      case 'coming-soon': renderMoviesList(app, { status: 'coming_soon' }); break;
      case 'cinemas': renderCinemas(app); break;
      case 'experiences': renderExperiences(app); break;
      case 'movie': renderMovieDetail(app, parts[1]); break;
      case 'seatvision': renderSeatVision(app, parts[1], parts[2]); break;
      case 'checkout': renderCheckout(app); break;
      case 'profile': renderProfile(app); break;
      case 'moodmatch': renderMoodMatch(app); break;
      case 'planner': renderPlanner(app); break;
      default: renderHome(app);
    }
  } catch (err){
    console.error(err);
    app.innerHTML = `<div class="empty-state"><h3>Something went wrong</h3><p>${esc(err.message)}</p></div>`;
  }

  const navMap = { home:'/', movies:'/movies', now:'/now-showing', coming:'/coming-soon', cinemas:'/cinemas', exp:'/experiences' };
  $$('.nav-link').forEach(l => {
    const href = navMap[l.dataset.nav];
    if (!href) return;
    l.classList.toggle('active', href === '/' ? hash === '/' : hash.startsWith(href));
  });

  window.scrollTo(0, 0);
  updateCartUI();
}

/* ═══════════════════ CARD BUILDERS ═══════════════════ */
function genreNames(m){
  if (!m.genres || m.genres.length === 0) return '—';
  return m.genres.map(g => {
    const found = D.genres.find(x => x.id === g);
    return found ? found[state.lang] : g;
  }).join(' · ');
}

function movieCard(m){
  const title = state.lang === 'ar' ? m.titleAr : m.titleEn;
  const badge = m.status === 'coming_soon'
    ? `<span class="movie-badge soon">${esc(t('status_soon'))}</span>`
    : m.status === 'now_showing'
    ? `<span class="movie-badge">${esc(t('status_now'))}</span>`
    : '';
  const posterImg = m.poster
    ? `<img src="${esc(m.poster)}" alt="${esc(title)}" loading="lazy" onerror="this.style.display='none'">`
    : '';
  return `
    <a href="#/movie/${esc(m.id)}" class="movie-card">
      <div class="movie-poster">
        ${posterImg}
        <div class="movie-poster-fallback">${esc(title)}</div>
        ${badge}
      </div>
      <div class="movie-info">
        <div class="movie-title">${esc(title)}</div>
        <div class="movie-meta">
          <span>${esc(genreNames(m))}</span>
          ${m.runtime ? `<span class="dot">·</span><span>${m.runtime} min</span>` : ''}
        </div>
      </div>
    </a>`;
}

function cinemaCard(v){
  const op = D.operators.find(o => o.id === v.operatorId);
  return `
    <div class="cinema-card">
      <div class="cinema-name">${esc(v.name)}</div>
      <div class="cinema-loc">${esc(v.area)}, ${esc(v.city)}</div>
      <div class="cinema-formats">
        ${v.formats.map(f => {
          const fmt = D.formats.find(x => x.id === f);
          return `<span class="format-chip">${esc(fmt ? fmt[state.lang] : f)}</span>`;
        }).join('')}
      </div>
      ${op ? `<a class="cinema-link" href="${esc(op.website)}" target="_blank" rel="noopener">${esc(op.name)} ↗</a>` : ''}
    </div>`;
}

/* ═══════════════════ VIEWS ═══════════════════ */
function renderHome(app){
  const featured = D.movies.find(m => m.featured && m.status === 'now_showing') || D.movies[0];
  const featuredTitle = state.lang === 'ar' ? featured.titleAr : featured.titleEn;
  const featuredSyn = state.lang === 'ar' ? featured.synopsisAr : featured.synopsisEn;

  const nowList = D.movies.filter(m => m.status === 'now_showing');
  const soonList = D.movies.filter(m => m.status === 'coming_soon');

  app.innerHTML = `
    <section class="hero">
      <div class="hero-bg"${featured.backdrop ? ` style="background-image:url('${esc(featured.backdrop)}')"` : ''}></div>
      <div class="hero-inner">
        <div class="hero-content">
          <span class="eyebrow">${esc(t('status_now'))}</span>
          <h1 class="hero-title">${esc(featuredTitle)}</h1>
          <div class="hero-meta">
            <span>${esc(genreNames(featured))}</span>
            <span class="dot"></span>
            <span>${featured.runtime} min</span>
            <span class="dot"></span>
            <span>${esc(featured.language)}</span>
            ${featured.classification ? `<span class="dot"></span><span>${esc(featured.classification)}</span>` : ''}
          </div>
          <p class="hero-synopsis">${esc(featuredSyn)}</p>
          <div class="hero-actions">
            <a href="#/movie/${esc(featured.id)}" class="btn btn-primary">${esc(t('hero_book'))}</a>
            <a href="#/movie/${esc(featured.id)}" class="btn btn-ghost">${esc(t('view_details'))}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2 class="section-title">${esc(t('section_now_showing'))}</h2>
        <a href="#/now-showing" class="section-link">${esc(t('explore_movies'))} →</a>
      </div>
      <div class="movie-grid">${nowList.map(movieCard).join('')}</div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2 class="section-title">${esc(t('section_coming_soon'))}</h2>
        <a href="#/coming-soon" class="section-link">${esc(t('explore_movies'))} →</a>
      </div>
      <div class="movie-grid">${soonList.map(movieCard).join('')}</div>
    </section>

    <section class="section">
      <div class="seatvision-promo">
        <div>
          <span class="eyebrow">${esc(t('section_seatvision'))}</span>
          <h2>${esc(t('seatvision_headline'))}</h2>
          <p>${esc(t('seatvision_demo_note'))}</p>
          <a href="#/now-showing" class="btn btn-primary">${esc(t('seatvision_cta'))}</a>
        </div>
        <div class="seatvision-mini" aria-hidden="true">
          <div class="mini-screen"></div>
          <div class="mini-seats">
            ${Array.from({ length: 18 }, (_, i) => `<div class="mini-seat${i === 8 ? ' on' : ''}"></div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2 class="section-title">${esc(t('section_cinemas'))}</h2>
        <a href="#/cinemas" class="section-link">${esc(t('explore_movies'))} →</a>
      </div>
      <div class="cinema-grid">${D.venues.slice(0, 6).map(cinemaCard).join('')}</div>
    </section>

    <section class="section" id="latestSection">
      <div class="section-head">
        <h2 class="section-title">${esc(t('section_latest'))}</h2>
        <span class="text-muted" style="font-size:.78rem">${esc(t('api_attribution'))}</span>
      </div>
      <div id="latestGrid" class="movie-grid">
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">
          ${esc(t('loading_movies'))}
        </div>
      </div>
    </section>

    <section class="final-cta">
      <h2>${esc(t('final_cta'))}</h2>
      <div class="hero-actions" style="justify-content:center;margin-top:2rem">
        <a href="#/movies" class="btn btn-primary btn-lg">${esc(t('explore_movies'))}</a>
        <a href="#/planner" class="btn btn-ghost btn-lg">${esc(t('plan_night'))}</a>
      </div>
    </section>
  `;

  getLatestMovies(12).then(list => {
    const grid = document.getElementById('latestGrid');
    if (!grid) return;
    if (!list || list.length === 0){
      grid.innerHTML = `<p class="text-muted" style="grid-column:1/-1;padding:2rem 0">${esc(t('api_error'))}</p>`;
      return;
    }
    grid.innerHTML = list.map(movieCard).join('');
  });
}

function renderMoviesList(app, filter){
  filter = filter || {};
  let list = D.movies.slice();
  if (filter.status) list = list.filter(m => m.status === filter.status);

  const heading = filter.status === 'now_showing' ? t('section_now_showing')
    : filter.status === 'coming_soon' ? t('section_coming_soon')
    : t('nav_movies');

  app.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${esc(heading)}</h1>
      <p class="page-sub">${esc(t('showtimes_demo_note'))}</p>
    </div>
    <div class="filters-bar">
      <input type="search" class="search-input" id="movieSearch" placeholder="${esc(t('nav_search'))}...">
      <button class="btn btn-outline btn-sm" id="loadApiBtn">${esc(t('section_latest'))}</button>
    </div>
    <section class="section" style="padding-top:1rem">
      <div class="movie-grid" id="movieResults">${list.map(movieCard).join('')}</div>
      <div class="empty-state" id="movieEmpty" style="display:none">
        <h3>${esc(t('empty_results'))}</h3>
      </div>
    </section>`;

  let allList = list;

  const search = $('#movieSearch');
  if (search){
    search.addEventListener('input', () => {
      const raw = search.value.trim();
      const q = raw.toLowerCase();
      const filtered = q ? allList.filter(m =>
        m.titleEn.toLowerCase().includes(q) || (m.titleAr && m.titleAr.includes(raw))
      ) : allList;
      $('#movieResults').innerHTML = filtered.map(movieCard).join('');
      $('#movieEmpty').style.display = filtered.length === 0 ? 'block' : 'none';
    });
  }

  const apiBtn = $('#loadApiBtn');
  if (apiBtn){
    apiBtn.addEventListener('click', async () => {
      apiBtn.disabled = true;
      apiBtn.textContent = t('loading_movies');
      const list2 = await getLatestMovies(30);
      apiBtn.style.display = 'none';
      if (list2 && list2.length){
        allList = list2;
        $('#movieResults').innerHTML = list2.map(movieCard).join('');
      } else {
        toast(t('api_error'), 'error');
        apiBtn.disabled = false;
        apiBtn.textContent = t('section_latest');
      }
    });
  }
}

function renderCinemas(app){
  app.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${esc(t('section_cinemas'))}</h1>
      <p class="page-sub">${esc(t('footer_legal'))}</p>
    </div>
    <section class="section" style="padding-top:1rem">
      <div class="cinema-grid">${D.venues.map(cinemaCard).join('')}</div>
    </section>`;
}

function renderExperiences(app){
  app.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${esc(t('section_experiences'))}</h1>
      <p class="page-sub">${esc(t('seatvision_demo_note'))}</p>
    </div>
    <section class="section" style="padding-top:1rem">
      <div class="cinema-grid">
        ${D.formats.map(f => `
          <div class="cinema-card">
            <div class="cinema-name">${esc(f[state.lang])}</div>
            <div class="cinema-loc">${esc(f.id === 'imax' ? 'Large format experience' : f.id === '4dx' ? 'Motion seats + effects' : f.id === 'vip' ? 'Luxury recliner seating' : f.id === '3d' ? 'Stereoscopic 3D' : f.id === 'max' ? 'Premium Large Format' : 'Classic cinema')}</div>
            <div class="format-chip" style="margin-top:.75rem">×${f.priceMod} price modifier</div>
          </div>
        `).join('')}
      </div>
    </section>`;
}

function renderMovieDetail(app, movieId){
  let m = D.movies.find(x => x.id === movieId);
  if (!m) m = apiMoviesCache.find(x => x.id === movieId);

  if (!m){
    app.innerHTML = `<div class="empty-state"><h3>${esc(t('empty_results'))}</h3></div>`;
    return;
  }

  const title = state.lang === 'ar' ? m.titleAr : m.titleEn;
  const synopsis = state.lang === 'ar' ? m.synopsisAr : m.synopsisEn;
  const inWatchlist = state.watchlist.includes(m.id);
  const isAPI = !!m._fromAPI;

  const times = D.showtimes.filter(s => s.movieId === m.id).slice(0, 40);
  const byVenue = {};
  times.forEach(s => { (byVenue[s.venueId] = byVenue[s.venueId] || []).push(s); });

  app.innerHTML = `
    <section class="hero" style="min-height:55vh">
      <div class="hero-bg"${m.backdrop ? ` style="background-image:url('${esc(m.backdrop)}')"` : ''}></div>
      <div class="hero-inner">
        <div class="hero-content">
          <h1 class="hero-title">${esc(title)}</h1>
          <div class="hero-meta">
            <span>${esc(genreNames(m))}</span>
            ${m.runtime ? `<span class="dot"></span><span>${m.runtime} min</span>` : ''}
            <span class="dot"></span>
            <span>${esc(m.language)}</span>
            ${m.classification ? `<span class="dot"></span><span>${esc(m.classification)}</span>` : ''}
            ${m.releaseDate ? `<span class="dot"></span><span>${esc(m.releaseDate)}</span>` : ''}
            ${m.rating ? `<span class="dot"></span><span class="rating">★ ${m.rating}</span>` : ''}
          </div>
          <p class="hero-synopsis">${esc(synopsis)}</p>
          ${m.cast && m.cast.length ? `<p style="font-size:0.85rem;color:var(--muted);margin-bottom:1rem">Starring: ${esc(m.cast.join(', '))}</p>` : ''}
          <div class="hero-actions">
            ${!isAPI ? `<button class="btn btn-primary" data-book="${esc(m.id)}">${esc(t('book_tickets'))}</button>` : ''}
            <button class="btn btn-ghost" id="wlBtn">${inWatchlist ? esc(t('remove_watchlist')) : esc(t('add_watchlist'))}</button>
          </div>
        </div>
      </div>
    </section>

    ${isAPI ? `
      <section class="section">
        <div class="demo-notice">${esc(t('api_attribution'))}</div>
        <p class="text-muted">${esc(t('showtimes_demo_note'))}</p>
      </section>
    ` : `
      <section class="section">
        <div class="section-head">
          <h2 class="section-title">${esc(t('nav_now'))}</h2>
          <span class="demo-notice">${esc(t('showtimes_demo_note'))}</span>
        </div>
        ${Object.keys(byVenue).length === 0
          ? `<p class="text-muted">${esc(t('empty_results'))}</p>`
          : Object.keys(byVenue).map(vid => {
              const v = D.venues.find(x => x.id === vid);
              if (!v) return '';
              return `
                <div style="margin-bottom:1.5rem">
                  <div style="margin-bottom:.75rem"><strong>${esc(v.name)}</strong> <span class="text-muted">· ${esc(v.area)}</span></div>
                  <div style="display:flex;flex-wrap:wrap;gap:.5rem">
                    ${byVenue[vid].map(s => {
                      const fmt = D.formats.find(f => f.id === s.format);
                      return `<a href="#/seatvision/${esc(m.id)}/${esc(s.id)}" class="btn btn-outline btn-sm">${esc(s.startTime)} · ${esc(fmt ? fmt[state.lang] : s.format)} · ${money(s.price)}</a>`;
                    }).join('')}
                  </div>
                </div>`;
            }).join('')
        }
      </section>
    `}`;

  const wb = $('#wlBtn');
  if (wb){
    wb.addEventListener('click', () => {
      const i = state.watchlist.indexOf(m.id);
      if (i >= 0) state.watchlist.splice(i, 1);
      else state.watchlist.push(m.id);
      saveWatchlist();
      renderMovieDetail(app, movieId);
    });
  }
  $$('[data-book]').forEach(btn => {
    btn.addEventListener('click', () => {
      const st = D.showtimes.find(s => s.movieId === btn.dataset.book);
      if (st) location.hash = `#/seatvision/${m.id}/${st.id}`;
      else toast(t('empty_results'), 'error');
    });
  });
}

/* ═══════════════════ SEATVISION (3D THREE.JS) ═══════════════════ */
function generateSeats(aud, showtime){
  const seats = [];
  const letters = 'ABCDEFGHIJKL';
  for (let r = 0; r < aud.rows; r++){
    const rowLetter = letters[r];
    for (let n = 1; n <= aud.seatsPerRow; n++){
      const premium = !!(aud.premiumRows && aud.premiumRows.includes(rowLetter));
      const accessible = aud.accessibleRow === rowLetter;
      const hash = (r * 7 + n * 13) % 11;
      const unavailable = hash === 0;
      const price = Math.round(showtime.price * (premium ? 1.4 : 1));
      seats.push({ id: `${rowLetter}${n}`, row: rowLetter, num: n, premium, accessible, unavailable, price });
    }
  }
  return seats;
}

function calculateView(seat, aud){
  const rowIndex = 'ABCDEFGHIJKL'.indexOf(seat.row);
  const seatCenter = aud.seatsPerRow / 2 + 0.5;
  const horizOffset = (seat.num - seatCenter) * aud.seatSpacing;
  const distance = aud.frontRowDistance + rowIndex * aud.rowSpacing;
  const angle = Math.atan(Math.abs(horizOffset) / distance) * 180 / Math.PI;

  let score = 100;
  score -= Math.min(60, angle * 1.8);
  if (distance < 6) score -= (6 - distance) * 8;
  if (distance > 18) score -= (distance - 18) * 2;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return { distance, angle, horizOffset, comfort: score };
}

function renderSeatVision(app, movieId, showtimeId){
  const m = D.movies.find(x => x.id === movieId);
  const st = D.showtimes.find(x => x.id === showtimeId);
  if (!m || !st){
    app.innerHTML = `<div class="empty-state"><h3>${esc(t('empty_results'))}</h3></div>`;
    return;
  }
  const venue = D.venues.find(v => v.id === st.venueId);
  const aud = D.auditoriums[st.auditoriumId] || D.auditoriums['hall-standard'];
  const seats = generateSeats(aud, st);
  const selected = new Set();

  app.innerHTML = `
    <div class="sv-wrap">
      <div class="sv-topbar">
        <div class="info"><div class="label">${esc(t('nav_movies'))}</div><div class="value">${esc(state.lang === 'ar' ? m.titleAr : m.titleEn)}</div></div>
        <div class="info"><div class="label">Cinema</div><div class="value">${esc(venue ? venue.name : '')}</div></div>
        <div class="info"><div class="label">Format</div><div class="value">${esc((D.formats.find(f => f.id === st.format) || {})[state.lang] || st.format)}</div></div>
        <div class="info"><div class="label">Date & Time</div><div class="value">${esc(st.date)} · ${esc(st.startTime)}</div></div>
      </div>

      <div class="sv-panel sv-map-panel">
        <div class="sv-panel-header">
          <h3>${esc(t('select_seats'))}</h3>
          <span class="demo-notice">DEMO</span>
        </div>
        <div class="sv-map-area">
          <div class="sv-screen-wrap"><div class="sv-screen"></div></div>
          <div class="sv-seatmap" id="seatmap" style="direction: ltr;"></div>
        </div>
        <div class="sv-legend">
          <div class="sv-legend-item"><span class="sv-legend-swatch"></span>${esc(t('seat_available'))}</div>
          <div class="sv-legend-item"><span class="sv-legend-swatch" style="background:var(--red-bright);border-color:var(--red-bright)"></span>${esc(t('seat_selected'))}</div>
          <div class="sv-legend-item"><span class="sv-legend-swatch" style="border-color:var(--gold);background:transparent"></span>${esc(t('seat_premium'))}</div>
          <div class="sv-legend-item"><span class="sv-legend-swatch" style="opacity:.35"></span>${esc(t('seat_occupied'))}</div>
        </div>
      </div>

      <div class="sv-panel sv-preview-panel">
        <div class="sv-panel-header"><h3>3D Cinema View</h3><span class="demo-notice">DEMO</span></div>
        <div class="sv-preview-area" id="threeCanvasContainer">
           <!-- Three.js Canvas -->
        </div>
        <div class="sv-metrics" id="svMetrics">
          <div class="sv-metric"><div class="k">${esc(t('select_seats'))}</div><div class="v">—</div></div>
        </div>
        
        <!-- Sticky Checkout Bar in Mobile -->
        <div class="sv-checkout-bar">
          <div class="sv-checkout-info">
            <div>
              <div class="total-label">${esc(t('total'))}</div>
              <div id="svTotal" class="total-val">${money(0)}</div>
            </div>
          </div>
          <button class="btn btn-primary btn-block" id="svConfirm" disabled>${esc(t('select_seats'))}</button>
        </div>

      </div>
    </div>`;

  // Build seat map (2D)
  const seatmap = $('#seatmap');
  const letters = 'ABCDEFGHIJKL';
  for (let r = 0; r < aud.rows; r++){
    const rowLetter = letters[r];
    const rowEl = document.createElement('div');
    rowEl.className = 'sv-row';
    const label = document.createElement('span');
    label.className = 'sv-row-label';
    label.textContent = rowLetter;
    rowEl.appendChild(label);

    for (let n = 1; n <= aud.seatsPerRow; n++){
      const seat = seats.find(s => s.row === rowLetter && s.num === n);
      if (!seat) continue;
      const el = document.createElement('button');
      el.className = 'sv-seat';
      if (seat.premium) el.classList.add('premium');
      if (seat.accessible) el.classList.add('accessible');
      if (seat.unavailable) el.classList.add('unavailable');
      el.dataset.id = seat.id;
      el.setAttribute('aria-label', `Row ${rowLetter} seat ${n}${seat.unavailable ? ' (unavailable)' : ''}`);
      if (!seat.unavailable){
        el.addEventListener('click', () => toggleSeat(seat, el));
      }
      rowEl.appendChild(el);
    }
    seatmap.appendChild(rowEl);
  }

  // ═══════════════════ THREE.JS 3D SETUP ═══════════════════
  const container = document.getElementById('threeCanvasContainer');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);
  scene.fog = new THREE.FogExp2(0x050505, 0.01);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  
  // Default View (from back of cinema)
  const defaultCamPos = new THREE.Vector3(0, 3, aud.frontRowDistance + (aud.rows * aud.rowSpacing) + 2);
  const defaultTarget = new THREE.Vector3(0, aud.screenHeight / 2 + aud.screenElevation, 0);
  camera.position.copy(defaultCamPos);
  camera.lookAt(defaultTarget);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0x404060, 1.5));
  const screenLight = new THREE.PointLight(0xffffff, 4, 80);
  screenLight.position.set(0, aud.screenHeight / 2, 1);
  scene.add(screenLight);
  
  const screenSpill = new THREE.PointLight(0x88aaff, 2, 50);
  screenSpill.position.set(0, 0, 8);
  scene.add(screenSpill);

  // Screen
  const screenGeo = new THREE.PlaneGeometry(aud.screenWidth, aud.screenHeight);
  const screenMesh = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  // Screen is at Z = 0
  screenMesh.position.set(0, aud.screenHeight / 2 + aud.screenElevation, 0);
  scene.add(screenMesh);

  // Glowing Screen Frame
  const frameGeo = new THREE.EdgesGeometry(screenGeo);
  const frame = new THREE.LineSegments(frameGeo, new THREE.LineBasicMaterial({ color: 0xE12C46 }));
  frame.position.copy(screenMesh.position);
  scene.add(frame);

  // Floor
  const floorGeo = new THREE.PlaneGeometry(aud.screenWidth * 2, aud.rows * aud.rowSpacing + 10);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9, metalness: 0.1 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, aud.frontRowDistance + (aud.rows * aud.rowSpacing) / 2);
  scene.add(floor);

  // 3D Seats
  const seatGeo = new THREE.BoxGeometry(0.5, 0.6, 0.5);
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 });
  const premiumMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.6 });
  const seatMeshes = {};

  for (let r = 0; r < aud.rows; r++){
    const rowLetter = letters[r];
    const zPos = aud.frontRowDistance + (r * aud.rowSpacing);
    const yPos = (aud.seatElevationStep || 0.08) * r + 0.3;

    for (let n = 1; n <= aud.seatsPerRow; n++){
      const seat = seats.find(s => s.row === rowLetter && s.num === n);
      if (!seat) continue;

      const xPos = (seat.num - (aud.seatsPerRow / 2 + 0.5)) * aud.seatSpacing;
      const mat = seat.premium ? premiumMat : seatMat;
      
      const mesh = new THREE.Mesh(seatGeo, mat.clone());
      mesh.position.set(xPos, yPos, zPos);
      mesh.rotation.x = -0.1; 
      scene.add(mesh);
      seatMeshes[seat.id] = mesh;
    }
  }

  // Animation Loop
  let targetCamPos = defaultCamPos.clone();
  let targetLookAt = defaultTarget.clone();

  function animate() {
    currentAnimationFrame = requestAnimationFrame(animate);
    
    camera.position.lerp(targetCamPos, 0.08);
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    const newLookAt = currentLookAt.lerp(targetLookAt, 0.08);
    camera.lookAt(newLookAt);

    renderer.render(scene, camera);
  }
  animate();

  // Handle Resize
  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w > 0 && h > 0) {
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  });
  resizeObserver.observe(container);

  // ═══════════════════ SEAT SELECTION LOGIC ═══════════════════
  function toggleSeat(seat, el){
    if (selected.has(seat.id)){
      selected.delete(seat.id);
      el.classList.remove('selected');
      if(seatMeshes[seat.id]) {
        seatMeshes[seat.id].material.color.setHex(seat.premium ? 0x3a2a1a : 0x222222);
        seatMeshes[seat.id].material.emissive.setHex(0x000000);
      }
    } else {
      selected.add(seat.id);
      el.classList.add('selected');
      if(seatMeshes[seat.id]) {
        seatMeshes[seat.id].material.color.setHex(0xE12C46);
        seatMeshes[seat.id].material.emissive.setHex(0x550000);
      }
    }
    
    const firstId = [...selected][0];
    if (firstId){
      const s = seats.find(x => x.id === firstId);
      moveCameraToSeat(s, aud);
      renderMetrics(s, calculateView(s, aud));
    } else {
      targetCamPos.copy(defaultCamPos);
      targetLookAt.copy(defaultTarget);
      renderMetrics(null, null);
    }
    updateTotal();
  }

  function moveCameraToSeat(seat, aud){
    const r = 'ABCDEFGHIJKL'.indexOf(seat.row);
    
    const x = (seat.num - (aud.seatsPerRow / 2 + 0.5)) * aud.seatSpacing;
    const z = aud.frontRowDistance + (r * aud.rowSpacing) - 0.2;
    const y = (aud.seatElevationStep || 0.08) * r + aud.eyeHeight; 

    targetCamPos.set(x, y, z);
    // Look at the center of the screen at Z = 0
    targetLookAt.set(0, aud.screenHeight / 2 + aud.screenElevation, 0);
  }

  function renderMetrics(seat, calc){
    const metrics = $('#svMetrics');
    if (!metrics) return;
    if (!seat){
      metrics.innerHTML = `<div class="sv-metric"><div class="k">Seat</div><div class="v">—</div></div>`;
      return;
    }
    metrics.innerHTML = `
      <div class="sv-metric"><div class="k">Row</div><div class="v">${seat.row}</div></div>
      <div class="sv-metric"><div class="k">Seat</div><div class="v">${seat.num}</div></div>
      <div class="sv-metric"><div class="k">Distance</div><div class="v">${calc.distance.toFixed(1)} m</div></div>
      <div class="sv-metric"><div class="k">Angle</div><div class="v">${calc.angle.toFixed(1)}°</div></div>
      <div class="sv-metric"><div class="k">Comfort</div><div class="v gold">${calc.comfort}/100</div></div>`;
  }

  function updateTotal(){
    let total = 0;
    selected.forEach(id => {
      const s = seats.find(x => x.id === id);
      if (s) total += s.price;
    });
    const totEl = $('#svTotal');
    if (totEl) totEl.textContent = money(total);
    const btn = $('#svConfirm');
    if (btn){
      btn.disabled = selected.size === 0;
      btn.textContent = selected.size === 0 ? t('select_seats') : `${t('checkout')} (${selected.size})`;
    }
  }

  const confirmBtn = $('#svConfirm');
  if (confirmBtn){
    confirmBtn.addEventListener('click', () => {
      if (selected.size === 0) return;
      let total = 0;
      const labels = [];
      selected.forEach(id => {
        const s = seats.find(x => x.id === id);
        if (s){ total += s.price; labels.push(`${s.row}${s.num}`); }
      });
      addToCart({
        type: 'ticket',
        name: `${state.lang === 'ar' ? m.titleAr : m.titleEn} — ${selected.size} seat${selected.size > 1 ? 's' : ''}`,
        detail: `${venue ? venue.name : ''} · ${st.date} ${st.startTime} · ${labels.join(', ')}`,
        total, movieId: m.id, showtimeId: st.id
      });
      toggleCart(true);
    });
  }
}

/* ═══════════════════ CHECKOUT / TICKET ═══════════════════ */
function renderCheckout(app){
  app.innerHTML = `
    <div class="checkout-wrap">
      <h1 class="page-title">${esc(t('checkout'))}</h1>
      <div class="demo-notice">${esc(t('demo_no_payment'))}</div>
      <div id="checkoutSummary" style="margin:2rem 0"></div>
      <button class="btn btn-primary btn-lg btn-block" id="payBtn">${esc(t('confirm_pay_demo'))}</button>
    </div>`;

  const summary = $('#checkoutSummary');
  const payBtn = $('#payBtn');
  if (state.cart.length === 0){
    summary.innerHTML = `<p class="text-muted">${esc(t('empty_cart'))}</p>`;
    payBtn.disabled = true;
    return;
  }
  summary.innerHTML = `
    ${state.cart.map(item => `
      <div class="ticket-row">
        <span class="k">${esc(item.name)}<br><small style="color:var(--muted)">${esc(item.detail || '')}</small></span>
        <span class="v">${money(item.total)}</span>
      </div>`).join('')}
    <div class="ticket-row" style="font-size:1.1rem;padding-top:1rem">
      <span class="k">${esc(t('total'))}</span>
      <span class="v" style="color:var(--gold)">${money(cartTotal())}</span>
    </div>`;

  payBtn.addEventListener('click', () => {
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';
    setTimeout(() => {
      const ref = 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      const booking = { ref, items: state.cart.slice(), total: cartTotal(), date: new Date().toISOString() };
      state.bookings.push(booking);
      saveBookings();
      state.cart = [];
      saveCart();
      updateCartUI();
      renderTicket(app, booking);
    }, 1600);
  });
}

function renderTicket(app, booking){
  app.innerHTML = `
    <div class="checkout-wrap">
      <div style="text-align:center;margin-bottom:2rem">
        <div style="font-size:3rem">🎬</div>
        <h1 class="page-title" style="font-size:2.5rem">Booking Confirmed</h1>
        <p class="text-muted">${esc(t('demo_no_payment'))}</p>
      </div>
      <div class="ticket">
        <h3>CINEVERSE DEMO TICKET</h3>
        <div class="ticket-meta">${esc(t('booking_reference'))}: <strong>${esc(booking.ref)}</strong></div>
        ${booking.items.map(item => `
          <div class="ticket-row">
            <span class="k">${esc(item.name)}</span>
            <span class="v">${money(item.total)}</span>
          </div>`).join('')}
        <div class="ticket-row" style="font-size:1.15rem">
          <span class="k">${esc(t('total'))}</span>
          <span class="v" style="color:var(--gold)">${money(booking.total)}</span>
        </div>
        <div class="ticket-qr">${generateQR(booking.ref)}</div>
        <div class="ticket-warn">${esc(t('demo_ticket_warning'))}</div>
      </div>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="window.print()">${esc(t('print_ticket'))}</button>
        <a href="#/" class="btn btn-primary">${esc(t('nav_home'))}</a>
      </div>
    </div>`;
}

function generateQR(text){
  const size = 12;
  let cells = '';
  const seed = text.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let y = 0; y < size; y++){
    for (let x = 0; x < size; x++){
      const on = ((x * 7 + y * 13 + seed) % 3) === 0
        || (x < 3 && y < 3) || (x > size - 4 && y < 3) || (x < 3 && y > size - 4);
      if (on) cells += `<rect x="${x * 8}" y="${y * 8}" width="8" height="8" fill="#000"/>`;
    }
  }
  return `<svg width="112" height="112" viewBox="0 0 ${size * 8} ${size * 8}">${cells}</svg>`;
}

function renderProfile(app){
  const bookings = state.bookings.slice().reverse();
  app.innerHTML = `
    <div class="checkout-wrap">
      <h1 class="page-title">${esc(t('nav_profile'))}</h1>
      <h2 style="margin-top:2rem;font-family:var(--font-display);letter-spacing:.06em">${esc(t('nav_tickets'))}</h2>
      ${bookings.length === 0
        ? `<p class="text-muted">No bookings yet.</p>`
        : bookings.map(b => `
          <div class="ticket" style="padding:1.25rem">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
              <div><strong>${esc(b.ref)}</strong> · ${new Date(b.date).toLocaleString()}</div>
              <div style="color:var(--gold);font-weight:700">${money(b.total)}</div>
            </div>
            <div style="margin-top:.5rem;font-size:.85rem;color:var(--muted)">${b.items.map(i => esc(i.name)).join(' · ')}</div>
          </div>`).join('')
      }
      <h2 style="margin-top:2rem;font-family:var(--font-display);letter-spacing:.06em">${esc(t('nav_watchlist'))}</h2>
      ${state.watchlist.length === 0
        ? `<p class="text-muted">Empty.</p>`
        : `<div class="movie-grid">${state.watchlist.map(id => {
            const m = D.movies.find(x => x.id === id) || apiMoviesCache.find(x => x.id === id);
            return m ? movieCard(m) : '';
          }).join('')}</div>`
      }
    </div>`;
}

function renderMoodMatch(app){
  app.innerHTML = `
    <div class="checkout-wrap">
      <h1 class="page-title">${esc(t('moodmatch_headline'))}</h1>
      <p class="text-muted" style="margin-bottom:2rem">Pick a mood and we'll find something.</p>
      <div class="genre-row" style="margin-bottom:2rem">
        ${D.genres.map(g => `<button class="genre-pill" data-mm="${g.id}">${esc(g[state.lang])}</button>`).join('')}
      </div>
      <div class="movie-grid" id="mmResult"></div>
    </div>`;

  $$('[data-mm]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-mm]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const g = btn.dataset.mm;
      const picks = D.movies.filter(m => m.genres.includes(g)).slice(0, 3);
      $('#mmResult').innerHTML = picks.length
        ? picks.map(movieCard).join('')
        : `<p class="text-muted">${esc(t('empty_results'))}</p>`;
    });
  });
}

function renderPlanner(app){
  app.innerHTML = `
    <div class="checkout-wrap">
      <h1 class="page-title">${esc(t('planner_headline'))}</h1>
      <p class="text-muted" style="margin-bottom:2rem">${esc(t('seatvision_demo_note'))}</p>
      <div class="demo-notice">DEMO</div>
      <button class="btn btn-primary btn-lg" id="planBtn" style="margin-top:1rem">${esc(t('planner_cta'))}</button>
      <div id="plannerResult" style="margin-top:2rem"></div>
    </div>`;

  $('#planBtn').addEventListener('click', () => {
    const pool = D.movies.filter(m => m.status === 'now_showing');
    const pick = pool[Math.floor(Math.random() * pool.length)];
    $('#plannerResult').innerHTML = `
      <h3 style="font-family:var(--font-display);margin-bottom:1rem">Suggested: ${esc(state.lang === 'ar' ? pick.titleAr : pick.titleEn)}</h3>
      <p class="text-muted">${esc(state.lang === 'ar' ? pick.synopsisAr : pick.synopsisEn)}</p>
      <a href="#/movie/${esc(pick.id)}" class="btn btn-primary" style="margin-top:1rem">${esc(t('book_tickets'))}</a>`;
  });
}

/* ═══════════════════ HEADER ACTIONS ═══════════════════ */
function initHeader(){
  $$('[data-action]').forEach(el => {
    if (el._cv_bound) return;
    el._cv_bound = true;
    el.addEventListener('click', (e) => {
      const action = el.dataset.action;
      switch (action){
        case 'cart': toggleCart(true); break;
        case 'closeCart': toggleCart(false); break;
        case 'lang': setLang(state.lang === 'en' ? 'ar' : 'en'); break;
        case 'closeModal': closeModal(); break;
        case 'menu':
          openModal(`
            <div style="padding:1.5rem">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
                <h2 style="font-family:var(--font-display);font-size:1.5rem">Menu</h2>
                <button data-action="closeModal" class="icon-btn">✕</button>
              </div>
              <div style="display:flex;flex-direction:column;gap:.5rem">
                <a href="#/" class="btn btn-outline" data-action="closeModal">${esc(t('nav_home'))}</a>
                <a href="#/movies" class="btn btn-outline" data-action="closeModal">${esc(t('nav_movies'))}</a>
                <a href="#/now-showing" class="btn btn-outline" data-action="closeModal">${esc(t('nav_now'))}</a>
                <a href="#/coming-soon" class="btn btn-outline" data-action="closeModal">${esc(t('nav_coming'))}</a>
                <a href="#/cinemas" class="btn btn-outline" data-action="closeModal">${esc(t('nav_cinemas'))}</a>
                <a href="#/experiences" class="btn btn-outline" data-action="closeModal">${esc(t('nav_experiences'))}</a>
                <a href="#/profile" class="btn btn-outline" data-action="closeModal">${esc(t('nav_profile'))}</a>
              </div>
            </div>`);
          break;
        case 'watchlist': location.hash = '#/profile'; break;
        case 'search':
          location.hash = '#/movies';
          setTimeout(() => { const s = $('#movieSearch'); if (s) s.focus(); }, 100);
          break;
      }
    });
  });

  const checkoutBtn = $('#checkoutBtn');
  if (checkoutBtn){
    checkoutBtn.addEventListener('click', () => {
      toggleCart(false);
      location.hash = '#/checkout';
    });
  }
}

/* ═══════════════════ INTRO & INIT ═══════════════════ */
function initIntro(){
  const intro = $('#intro');
  const shell = $('#shell');

  const reveal = () => {
    intro.classList.add('hidden');
    shell.classList.add('visible');
    shell.setAttribute('aria-hidden', 'false');
    sessionStorage.setItem('cv_intro_seen', '1');
  };

  if (sessionStorage.getItem('cv_intro_seen')){
    intro.classList.add('hidden');
    shell.classList.add('visible');
    shell.setAttribute('aria-hidden', 'false');
    return;
  }

  const skipBtn = $('#skipIntro');
  if (skipBtn) skipBtn.addEventListener('click', reveal);
  setTimeout(reveal, 3200);
}

function init(){
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  const ll = $('#langLabel'); if (ll) ll.textContent = state.lang.toUpperCase();

  initIntro();
  initHeader();

  window.addEventListener('hashchange', route);
  if (!location.hash) location.hash = '#/';
  route();

  window.addEventListener('scroll', () => {
    const h = $('#header');
    if (h) h.classList.toggle('scrolled', window.scrollY > 30);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();