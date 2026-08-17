const slugify = (str) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("slugify", slugify);

  eleventyConfig.addFilter("isUrl", (str) =>
    typeof str === "string" && /^https?:\/\//.test(str)
  );

  eleventyConfig.addFilter("hostname", (url) => {
    try { return new URL(url).hostname; } catch { return url; }
  });

  eleventyConfig.addFilter("minutesToDuration", (minutes) => {
    if (!minutes) return undefined;
    return `PT${minutes}M`;
  });

  eleventyConfig.addCollection("recipes", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/recipes/*.md")
      .sort((a, b) => a.data.title.localeCompare(b.data.title))
  );

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("src/recipes/*.md").forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return [...tagSet].sort();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
};
