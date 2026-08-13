(function () {
  "use strict";

  // Ingredient checkboxes: tick items off while cooking, and remember the
  // state per-recipe across reloads via localStorage.
  const list = document.querySelector("[data-ingredients]");
  if (!list) return;

  const storageKey = "ingredients:" + window.location.pathname;
  const boxes = Array.prototype.slice.call(
    list.querySelectorAll(".ingredient__check")
  );

  let saved = [];
  try {
    saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
  } catch (e) {
    saved = [];
  }

  function persist() {
    const checked = [];
    boxes.forEach(function (box, i) {
      if (box.checked) checked.push(i);
    });
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch (e) {
      /* storage unavailable — ignore */
    }
  }

  boxes.forEach(function (box, i) {
    if (saved.indexOf(i) !== -1) box.checked = true;
    box.addEventListener("change", persist);
  });
})();
