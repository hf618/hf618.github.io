(() => {
  'use strict';

  const list = document.getElementById('publication-list');
  const controls = document.getElementById('publication-filters');
  if (!list || !controls) return;

  // Keep the original rows so switching views preserves each paper's content.
  const papers = Array.from(list.querySelectorAll('.publication-entry'));
  const topics = [
    ['embodied', 'Embodied Intelligence'],
    ['generative', 'Generative Models'],
    ['reasoning', 'LLM Reasoning'],
    ['adaptation', 'Adaptation & Robustness'],
    ['graph', 'Graph Learning'],
  ];
  const years = [...new Set(papers.map(paper => paper.dataset.year))]
    .sort((a, b) => Number(b) - Number(a));
  const modes = Array.from(controls.querySelectorAll('[data-pub-mode]'));
  const status = document.getElementById('publication-status');
  let currentMode;

  function addLinks(container, entries, prefix) {
    entries.forEach(([id, label], index) => {
      if (index) {
        const separator = document.createElement('span');
        separator.className = 'publication-filter-separator';
        separator.textContent = '/';
        separator.setAttribute('aria-hidden', 'true');
        container.append(separator);
      }
      const link = document.createElement('a');
      link.href = `#pub-${prefix}-${id}`;
      link.textContent = label;
      container.append(link);
    });
  }

  addLinks(document.getElementById('publication-year-links'),
    years.map(year => [year, year]), 'year');
  addLinks(document.getElementById('publication-topic-links'),
    topics.filter(([id]) => papers.some(paper => paper.dataset.topic === id)), 'topic');

  function groupHeading(id, label) {
    const row = document.createElement('tr');
    row.className = 'publication-group';
    const cell = document.createElement('td');
    cell.colSpan = 2;
    const heading = document.createElement('h3');
    heading.id = id;
    heading.textContent = label;
    cell.append(heading);
    row.append(cell);
    return row;
  }

  function render(mode) {
    if (mode === currentMode) return;
    const playing = papers.flatMap(paper => Array.from(paper.querySelectorAll('video')))
      .filter(video => video.isConnected && !video.paused);
    const fragment = document.createDocumentFragment();
    let shown;
    if (mode === 'selected') {
      shown = papers.filter(paper => paper.dataset.selected === 'true');
      fragment.append(...shown);
    } else {
      shown = papers;
      const groups = mode === 'date' ? years.map(year => [year, year]) : topics;
      const field = mode === 'date' ? 'year' : 'topic';
      groups.forEach(([id, label]) => {
        const matches = papers.filter(paper => paper.dataset[field] === id);
        if (!matches.length) return;
        fragment.append(groupHeading(`pub-${field}-${id}`, label), ...matches);
      });
    }
    list.replaceChildren(fragment);
    currentMode = mode;
    modes.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.pubMode === mode));
    });
    status.textContent = mode === 'selected'
      ? `${shown.length} first- and co-first-author papers.`
      : `${shown.length} papers grouped by ${mode === 'date' ? 'year' : 'research topic'}.`;
    playing.filter(video => video.isConnected).forEach(video => {
      video.play().catch(() => {});
    });
  }

  function applyLocation(scroll) {
    const id = location.hash.slice(1);
    let mode = 'selected';
    if (id === 'publications-by-date' || years.some(year => id === `pub-year-${year}`)) {
      mode = 'date';
    } else if (id === 'publications-by-topic' || topics.some(([topic]) => id === `pub-topic-${topic}`)) {
      mode = 'topic';
    } else if (papers.some(paper => paper.id === id && paper.dataset.selected !== 'true')) {
      // Existing links to individual papers must work even outside the selected view.
      mode = 'date';
    }
    render(mode);
    controls.querySelectorAll('a').forEach(link => {
      if (link.hash === location.hash) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (scroll) {
      const target = document.getElementById(id)
        || (id.startsWith('publications-by-') ? document.getElementById('publications') : null);
      if (target) requestAnimationFrame(() => target.scrollIntoView({block: 'start'}));
    }
  }

  modes.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.pubMode;
      const hash = mode === 'selected' ? '#publications' : `#publications-by-${mode}`;
      history.pushState(null, '', hash);
      applyLocation(false);
    });
  });
  controls.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#pub-"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    applyLocation(true);
  });
  window.addEventListener('hashchange', () => applyLocation(true));
  controls.hidden = false;
  applyLocation(Boolean(location.hash));
})();
