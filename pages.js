/* Shared menu, search field, and sign-out behavior for DB PLAY supporting pages. */
const menuBtn = document.getElementById('menuBtn');
const menuPanel = document.getElementById('menuPanel');
function setMenu(open) {
  if (!menuBtn || !menuPanel) return;
  menuPanel.classList.toggle('active', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  const icon = menuBtn.querySelector('i');
  if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}
if (menuBtn && menuPanel) {
  menuBtn.addEventListener('click', event => { event.stopPropagation(); setMenu(!menuPanel.classList.contains('active')); });
  menuPanel.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', () => setMenu(false));
}
const searchInput = document.getElementById('searchInput');
const searchIcon = document.getElementById('searchIcon');
const searchForm = document.getElementById('searchForm');
function toggleSearch(open) {
  if (!searchInput) return;
  searchInput.classList.toggle('active', open);
  if (open) searchInput.focus();
  else { searchInput.value = ''; searchInput.removeAttribute('aria-invalid'); }
}
if (searchIcon && searchInput) {
  searchIcon.addEventListener('click', () => toggleSearch(!searchInput.classList.contains('active')));
  searchIcon.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSearch(!searchInput.classList.contains('active')); } });
}
if (searchForm && searchInput) {
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    const searchable = [...document.querySelectorAll('.track-row, .news-card, .featured-news, .contact-detail')];
    const match = searchable.find(item => item.textContent.toLowerCase().includes(query));
    searchable.forEach(item => item.classList.remove('search-match'));
    if (match) { match.classList.add('search-match'); match.scrollIntoView({behavior:'smooth', block:'center'}); searchInput.removeAttribute('aria-invalid'); }
    else searchInput.setAttribute('aria-invalid', 'true');
  });
}
const signOut = document.getElementById('signOut');
if (signOut) signOut.addEventListener('click', () => { try { localStorage.removeItem('dbplay-user'); sessionStorage.clear(); } catch (error) { /* storage may be unavailable */ } });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { setMenu(false); if (searchInput && searchInput.classList.contains('active')) toggleSearch(false); } });
