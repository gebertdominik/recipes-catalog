(function () {
  "use strict";

  var STORAGE_KEY = "lang";
  var DEFAULT_LANG = "pl";
  var LANGS = ["pl", "en"];

  var translations = {
    pl: {
      "site.title":          "Katalog Przepisów",
      "site.description":    "Osobista kolekcja przepisów.",
      "nav.all":             "Wszystkie przepisy",
      "search.placeholder":  "Szukaj przepisów…",
      "filter.all":          "Wszystkie",
      "noResults":           "Żaden przepis nie pasuje do wyszukiwania.",
      "footer.builtWith":    "Katalog Przepisów — zbudowane z",
      "recipe.back":         "← Wszystkie przepisy",
      "recipe.servings":     "Porcje",
      "recipe.prep":         "Przygotowanie",
      "recipe.cook":         "Gotowanie",
      "recipe.total":        "Łącznie",
      "recipe.ingredients":  "Składniki",
      "recipe.instructions": "Instrukcje",
      "recipe.source":       "Źródło",
      "tags.label":          "Oznaczone",
    },
    en: {
      "site.title":          "Recipes Catalog",
      "site.description":    "A personal collection of recipes.",
      "nav.all":             "All recipes",
      "search.placeholder":  "Search recipes…",
      "filter.all":          "All",
      "noResults":           "No recipes match your search.",
      "footer.builtWith":    "Recipes Catalog — built with",
      "recipe.back":         "← All recipes",
      "recipe.servings":     "Servings",
      "recipe.prep":         "Prep",
      "recipe.cook":         "Cook",
      "recipe.total":        "Total",
      "recipe.ingredients":  "Ingredients",
      "recipe.instructions": "Instructions",
      "recipe.source":       "Source",
      "tags.label":          "Tagged",
    },
  };

  // To add a new tag:
  //   1. Add it to a recipe's `tags:` list in its .md frontmatter (lowercase, e.g. "vegan").
  //      The filter button, tag page, and pills are generated automatically.
  //   2. Add the translations below under the same lowercase key in both "pl" and "en".
  var tagTranslations = {
    pl: {
      breakfast:  "Śniadanie",
      dinner:     "Obiad",
      dessert:    "Deser",
      vegetarian: "Wegetariańskie",
      quick:      "Szybkie",
      soup:       "Zupa",
      baking:     "Pieczenie",
    },
    en: {
      breakfast:  "Breakfast",
      dinner:     "Dinner",
      dessert:    "Dessert",
      vegetarian: "Vegetarian",
      quick:      "Quick",
      soup:       "Soup",
      baking:     "Baking",
    },
  };

  function getLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    return LANGS.indexOf(stored) !== -1 ? stored : DEFAULT_LANG;
  }

  function applyLang(lang) {
    var t = translations[lang];
    var tags = tagTranslations[lang];

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Tag pills
    document.querySelectorAll("[data-i18n-tag]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-tag");
      if (tags[key] !== undefined) el.textContent = tags[key];
    });

    // Tag filter buttons (use data-tag as the key)
    document.querySelectorAll(".tag-filter[data-tag]:not([data-tag=''])").forEach(function (el) {
      var key = el.getAttribute("data-tag");
      if (tags[key] !== undefined) el.textContent = tags[key];
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });
  }

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang");
      localStorage.setItem(STORAGE_KEY, lang);
      applyLang(lang);
    });
  });

  applyLang(getLang());
})();
