(function () {
  "use strict";

  const searchInput = document.getElementById("recipe-search");
  const grid = document.getElementById("recipe-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".recipe-card"));
  const tagButtons = Array.from(document.querySelectorAll(".tag-filter"));
  const noResults = document.getElementById("no-results");

  let query = "";
  let activeTag = "";

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = card.getAttribute("data-search") || "";
      const tags = (card.getAttribute("data-tags") || "").split(/\s+/);

      const matchesQuery = !query || haystack.indexOf(query) !== -1;
      const matchesTag = !activeTag || tags.indexOf(activeTag) !== -1;
      const visible = matchesQuery && matchesTag;

      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      query = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  tagButtons.forEach((button) => {
    button.addEventListener("click", function () {
      activeTag = button.getAttribute("data-tag") || "";
      tagButtons.forEach((b) => b.classList.toggle("is-active", b === button));
      applyFilters();
    });
  });
})();
