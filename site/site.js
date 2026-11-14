// The download page. The button works without this file; it only adds the note
// for non-Windows visitors and fills the game list from the launcher's catalog,
// so a new game shows up here as soon as it's in games.json.
(() => {
  if (!/Windows/i.test(navigator.userAgent)) {
    document.getElementById('not-windows').hidden = false;
  }

  const grid = document.getElementById('game-grid');
  const count = document.getElementById('games-count');
  const failed = document.getElementById('games-error');

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function cover(game) {
    if (game.cover) {
      const img = make('img', 'cover');
      img.src = game.cover;
      img.alt = `${game.title} cover art`;
      img.width = 600;
      img.height = 800;
      img.loading = 'lazy';
      return img;
    }
    // The catalog allows games with no art yet.
    const blank = make('div', 'cover cover-blank', game.title);
    if (game.accent) blank.style.backgroundColor = game.accent;
    return blank;
  }

  function card(game) {
    const item = make('li', 'game');
    item.append(cover(game), make('h3', null, game.title));
    if (game.tagline) item.append(make('p', 'tagline', game.tagline));

    const meta = make('p', 'game-meta');
    const price = game.price ? make('strong', null, `$${game.price}`) : make('strong', 'free', 'Free');
    meta.append(price);
    const tags = (game.tags || []).slice(0, 3);
    if (tags.length) meta.append(` · ${tags.join(' · ')}`);
    item.append(meta);
    return item;
  }

  function summary(games) {
    const total = `${games.length} ${games.length === 1 ? 'game' : 'games'}`;
    if (games.some((game) => game.price)) return total;
    return games.length === 1 ? `${total}, free right now` : `${total}, all free right now`;
  }

  fetch('games.json', { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(({ games }) => {
      if (!Array.isArray(games) || !games.length) throw new Error('empty catalog');
      grid.replaceChildren(...games.map(card));
      count.textContent = summary(games);
    })
    .catch(() => {
      failed.hidden = false;
    });
})();
