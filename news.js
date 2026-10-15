/* News page: the header search box filters the story cards as you type. */
(function () {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const cards = [...document.querySelectorAll('.featured-news, .news-card')];

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    cards.forEach(card => {
      const match = !q || card.textContent.toLowerCase().includes(q);
      card.style.display = match ? '' : 'none';
    });
  });
})();
