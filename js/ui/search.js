// js/ui/search.js — Full-text search across all F-14 technical data

window.F14Search = (function() {
  const index = [];

  function buildIndex() {
    const sources = [
      { data: window.F14_AIRFRAME, category: 'Airframe', prefix: 'AF' },
      { data: window.F14_ENGINES, category: 'Engines', prefix: 'EN' },
      { data: window.F14_AVIONICS, category: 'Avionics', prefix: 'AV' },
      { data: window.F14_WEAPONS, category: 'Weapons', prefix: 'WP' },
      { data: window.F14_FLIGHT, category: 'Flight', prefix: 'FL' },
      { data: window.F14_HISTORY, category: 'History', prefix: 'HI' },
    ];

    sources.forEach(src => {
      if (!src.data) return;
      indexData(src.data, src.category, src.prefix, []);
    });
  }

  function indexData(obj, category, prefix, path) {
    if (typeof obj === 'string' || typeof obj === 'number') {
      const key = path.join('.') || 'data';
      index.push({
        id: `${prefix}_${index.length}`,
        key,
        category,
        value: String(obj),
        path,
      });
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => indexData(item, category, prefix, [...path, String(i)]));
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([k, v]) => {
        indexData(v, category, prefix, [...path, k]);
      });
    }
  }

  function search(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return index
      .filter(entry => {
        const keyMatch = entry.key.toLowerCase().includes(q);
        const valueMatch = entry.value.toLowerCase().includes(q);
        return keyMatch || valueMatch;
      })
      .sort((a, b) => {
        const aV = a.value.toLowerCase().startsWith(q) ? 1 : 0;
        const bV = b.value.toLowerCase().startsWith(q) ? 1 : 0;
        return bV - aV;
      })
      .slice(0, 15)
      .map(e => ({
        title: `${e.category} — ${formatKey(e.key)}`,
        text: `${e.value.slice(0, 120)}${e.value.length > 120 ? '…' : ''}`,
        category: e.category,
        path: e.path.join(' > '),
      }));
  }

  function formatKey(key) {
    return key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  buildIndex();

  return { search };
})();
