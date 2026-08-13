# Recipe Site — Eleventy + GitHub Pages

## Context

The goal is a personal recipe website: recipes authored as Markdown files with
YAML frontmatter, built into a static site with Eleventy (11ty), and deployed
via GitHub Pages using GitHub Actions. Decided in prior discussion:

- **Generator:** Eleventy (11ty)
- **Recipe format:** YAML frontmatter (title, servings, times, tags,
  ingredients, image) + Markdown body (instructions/notes)
- **Features:** tags/categories, client-side search, per-recipe images,
  print-friendly stylesheet
- **Styling:** Pico.css (classless CSS framework, via CDN) + small custom CSS
- **Repo:** built locally first; user will create the GitHub repo and push
  themselves (no remote/push actions in this task)

The project directory is currently empty except for two scaffold files
(`package.json`, `eleventy.config.js`) written before this planning pass —
these will be reviewed/kept as part of Task 1 rather than recreated from
scratch.

## Task Breakdown

**1. Project scaffolding**
- `package.json` (11ty as devDependency, `build`/`serve` scripts) — already drafted, verify content
- `eleventy.config.js` — passthrough copy for `src/assets`, `recipes` collection (sorted), `tagList` collection, `slugify` filter — already drafted, verify content
- `.gitignore` (`node_modules`, `_site`)
- Directory layout under `src/`: `_includes/layouts`, `_includes/partials`, `_data`, `recipes`, `assets/{css,js,images}`

**2. Recipe content schema + sample recipes**
- Frontmatter fields: `title`, `description`, `image`, `tags` (list), `servings`, `prepTime`/`cookTime`/`totalTime` (minutes), `ingredients` (list of strings)
- Markdown body: instructions as a numbered list, optional `## Notes` section
- Add 3 sample recipes in `src/recipes/*.md` covering different tags, so listing/tag/search features have real data to render against

**3. Layouts & partials**
- `src/_includes/layouts/base.njk`: HTML shell, Pico.css CDN link, custom stylesheet, header/nav, footer, `{% block %}`-style content area
- `src/_includes/layouts/recipe.njk`: recipe detail page — hero image, meta (servings/times), tag pills linking to tag pages, ingredients list, rendered Markdown body, plus embedded `schema.org/Recipe` JSON-LD for SEO (using the `minutesToDuration` filter already stubbed in config)
- `src/_includes/partials/recipe-card.njk`: reusable card (image, title, description, tags) used by home page and tag pages, with `data-search` attribute containing lowercased title+tags+ingredients for client-side filtering

**4. Pages**
- `src/index.njk`: intro, search input, tag filter buttons, grid of recipe cards (all recipes, works with JS disabled since it's server-rendered)
- `src/tags.njk`: paginate over `collections.tagList`, one output page per tag at `/tags/<tag>/`, reusing `recipe-card` partial filtered to that tag

**5. Client-side search/filter**
- `src/assets/js/search.js`: no dependencies — reads the `data-search` attribute on each `.recipe-card` in the DOM, filters by substring match against the search box value, and (on the home page) toggles cards by active tag-button state too
- Wire script include in `base.njk` (deferred script tag)

**6. Styling**
- `src/assets/css/style.css`: custom overrides on top of Pico.css — recipe card grid, tag pill styling, active-filter state, and a `@media print` block that hides nav/search/footer and tightens spacing for kitchen use

**7. Deployment**
- `.github/workflows/deploy.yml`: on push to `main`, `actions/checkout` → `actions/setup-node` → `npm ci` → `actions/configure-pages` (captures base path for project pages) → `npm run build` (with `PATH_PREFIX` env from configure-pages output) → `actions/upload-pages-artifact` → `actions/deploy-pages`
- No repo creation/push/remote-setting — user handles that themselves; README will note enabling Pages under Settings → Pages → Source: GitHub Actions

**8. Documentation**
- `README.md`: how to add a new recipe (frontmatter schema + example), local dev (`npm install`, `npm run serve`), how deployment works, how to enable GitHub Pages

**9. Local verification**
- `npm install`, `npm run build` to confirm a clean 11ty build with no errors
- `npm run serve` and manually check: home page renders cards, search filters by typing an ingredient/title, tag buttons/tag pages narrow the list, a recipe detail page renders with image/meta/instructions, print preview (`Cmd+P`) looks clean

**10. Publish to GitHub and go live**
This is the actual "on the internet" step — none of the above matters until this runs. Each of these is a real action taken against GitHub, so I'll confirm with you before each one (repo name/visibility, and the push itself):
- `git init`, initial commit of everything except `node_modules`/`_site`
- Create the GitHub repo — either you create it and give me the URL, or I create it with `gh repo create` (confirming name + public/private first)
- Add the remote, push `main`
- In the repo's Settings → Pages, set Source to "GitHub Actions" (one-time, only needed if not already configured)
- Watch the Actions run triggered by the push (`gh run watch` or the Actions tab) until the `deploy.yml` workflow succeeds
- **Path prefix check:** if the repo is a project page (i.e. not named `<username>.github.io`), the site is served from `https://<username>.github.io/<repo>/` — confirm the `configure-pages` → `PATH_PREFIX` wiring in the workflow (Task 7) actually produces correct asset/internal links at that subpath, since this is the #1 way 11ty GitHub Pages deploys break (assets/links resolve to `/` instead of `/<repo>/`)
- Open the published URL and re-run the manual checks from Task 9 (search, tags, recipe page, print) against the live site, not just localhost

## Verification

- `npm run build` completes without errors and produces `_site/` with `index.html`, per-recipe pages, and `/tags/<tag>/index.html` for each tag
- `npm run serve` locally: exercise search box, tag filters, tag pages, a recipe page, and print view
- Confirm `_site` output is excluded from git via `.gitignore`
- After Task 10: the GitHub Actions workflow run succeeds, and the live `https://<username>.github.io/...` URL actually renders the site correctly (not just a blank page from a wrong path prefix) — search, tag pages, and a recipe page all work when clicked on the live site
