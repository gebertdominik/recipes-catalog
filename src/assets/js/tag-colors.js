(function () {
  "use strict";

  const PALETTE_SIZE = 6;

  function hashTag(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h % PALETTE_SIZE;
  }

  // Use the stable English key (data-i18n-tag or data-tag) for consistent colors
  // regardless of which language is active.
  document.querySelectorAll(".tag-pill[data-i18n-tag], .tag-filter[data-tag]:not([data-tag=''])").forEach(function (el) {
    const key = el.dataset.i18nTag || el.dataset.tag || el.textContent.trim().toLowerCase();
    el.dataset.color = hashTag(key);
  });
})();
