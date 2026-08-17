# Recipes Catalog

A personal recipe website. Recipes are plain Markdown files with YAML
frontmatter, built into a static site with [Eleventy (11ty)](https://www.11ty.dev/)
and deployed to GitHub Pages.

## Local development

```bash
npm install      # install Eleventy
npm run serve    # start a local dev server with live reload
npm run build    # build the static site into _site/
```

The dev server prints a local URL (usually http://localhost:8080).

## Adding a recipe

Create a new Markdown file in `src/recipes/`, e.g. `src/recipes/banana-bread.md`.
The filename doesn't matter for the URL — the page URL is derived from the
`title`. Use this template:

```markdown
---
title: Banana Bread
description: A moist, easy loaf that uses up overripe bananas.
image: /assets/images/banana-bread.jpg   # optional; leave as "" for none
tags:
  - baking
  - vegetarian
servings: 8
prepTime: 15      # minutes
cookTime: 55      # minutes
totalTime: 70     # minutes
ingredients:
  - amount: "3"
    item: ripe bananas, mashed
  - amount: 200 g
    item: flour
  - amount: 150 g
    item: sugar
  - item: A pinch of salt      # amount is optional — omit it for "to taste" items
---

1. Preheat the oven to 175°C (350°F).
2. Mix the wet ingredients, then fold in the dry.
3. Bake for 55 minutes.

## Notes

Optional free-form notes go here.
```

### Field reference

| Field         | Type            | Required | Notes                                        |
| ------------- | --------------- | -------- | -------------------------------------------- |
| `title`       | string          | yes      | Also determines the page URL                 |
| `description` | string          | no       | Short summary shown on cards & detail page   |
| `image`       | string (path)   | no       | Path under `/assets/images/`; `""` for none  |
| `tags`        | list of strings | no       | Each tag gets its own filterable listing page |
| `servings`    | number/string   | no       |                                              |
| `prepTime`    | number (min)    | no       |                                              |
| `cookTime`    | number (min)    | no       |                                              |
| `totalTime`   | number (min)    | no       |                                              |
| `ingredients` | list of objects | no       | Each has an optional `amount` and an `item` (see below) |
| `source`      | string          | no       | Origin of the recipe — a URL renders as a clickable link, any other string renders as plain text |

**Ingredients** are a list of objects, each with:

- `amount` (optional) — the quantity, shown in its own aligned column, e.g. `250 g`, `2 tbsp`, `1/2 tsp`. Wrap bare numbers in quotes (`"2"`) so YAML treats them as text. Omit entirely for "to taste" / "for the pan" items.
- `item` (required) — the ingredient name, e.g. `all-purpose flour`.

On the recipe page each ingredient gets a **checkbox** you can tick off while
cooking; ticks are remembered per-recipe in your browser. Plain string
ingredients (the old `- 250 g flour` form) still render for backward
compatibility, but the object form gives the clean two-column layout.

The Markdown body below the frontmatter is the instructions (a numbered list
works best), plus any optional `## Notes` section.

### Tags

Each tag in a recipe's `tags:` list automatically generates a filter button on the
home page and a dedicated listing page (e.g. `/tags/baking/`).

If you use a **new tag** that doesn't exist yet, also add its translations to
`src/assets/js/i18n.js` under `tagTranslations`, using the lowercase tag value as
the key in both languages:

```js
pl: { ..., vegan: "Wegańskie" },
en: { ..., vegan: "Vegan" },
```

Tags without a translation entry display the raw frontmatter string — no error,
just untranslated.

### Images

Put image files in `src/assets/images/` and reference them from a recipe's
`image` field as `/assets/images/your-file.jpg`.

## Deployment

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`).
Every push to the `main` branch builds the site and publishes it to GitHub
Pages.

### One-time setup on GitHub

1. Create a repository and push this project to it.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push to `main` (or re-run the workflow) — the site deploys automatically.

The workflow uses `actions/configure-pages` to detect the correct base path,
so the site works whether it's served from a user page
(`https://<user>.github.io/`) or a project page
(`https://<user>.github.io/<repo>/`).
