(function () {
  const cache = new Map();

  async function loadText(url) {
    if (cache.has(url)) return cache.get(url);
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Cannot load ' + url + ': ' + response.status);
    const text = await response.text();
    cache.set(url, text);
    return text;
  }

  async function loadSectionInto(target, sectionPath) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) throw new Error('Section target not found');
    element.innerHTML = await loadText(sectionPath);
    return element;
  }

  window.SectionLoader = {
    loadText,
    loadSectionInto,
    clearCache() { cache.clear(); }
  };

  document.documentElement.dataset.sectionLoader = 'ready';
})();
