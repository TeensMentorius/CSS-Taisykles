function updateRangeFill(rangeEl) {
  if (!rangeEl) return;
  const min = Number(rangeEl.min || 0);
  const max = Number(rangeEl.max || 100);
  const val = Number(rangeEl.value || 0);
  const p = max === min ? 0 : ((val - min) / (max - min)) * 100;
  rangeEl.style.setProperty("--p", `${p}%`);
}

const bmMarginEl = document.getElementById("boxModelMargin");
const bmBorderEl = document.getElementById("boxModelBorder");
const bmPaddingEl = document.getElementById("boxModelPadding");
const bmContentEl = document.getElementById("boxModelContent");

const bmBorderWidth = document.getElementById("bmBorderWidth");
const bmBorderWidthValue = document.getElementById("bmBorderWidthValue");

const bmPaddingTop = document.getElementById("bmPaddingTop");
const bmPaddingRight = document.getElementById("bmPaddingRight");
const bmPaddingBottom = document.getElementById("bmPaddingBottom");
const bmPaddingLeft = document.getElementById("bmPaddingLeft");
const bmPaddingTopValue = document.getElementById("bmPaddingTopValue");
const bmPaddingRightValue = document.getElementById("bmPaddingRightValue");
const bmPaddingBottomValue = document.getElementById("bmPaddingBottomValue");
const bmPaddingLeftValue = document.getElementById("bmPaddingLeftValue");

const bmMarginTop = document.getElementById("bmMarginTop");
const bmMarginRight = document.getElementById("bmMarginRight");
const bmMarginBottom = document.getElementById("bmMarginBottom");
const bmMarginLeft = document.getElementById("bmMarginLeft");
const bmMarginTopValue = document.getElementById("bmMarginTopValue");
const bmMarginRightValue = document.getElementById("bmMarginRightValue");
const bmMarginBottomValue = document.getElementById("bmMarginBottomValue");
const bmMarginLeftValue = document.getElementById("bmMarginLeftValue");

const boxModelResetBtn = document.getElementById("boxModelResetBtn");
const boxModelCssOut = document.getElementById("boxModelCssOut");
const boxModelRules = document.getElementById("boxModelRules");
const bmTotalOut = document.getElementById("bmTotalOut");

const ok =
  bmMarginEl &&
  bmBorderEl &&
  bmPaddingEl &&
  bmContentEl &&
  bmBorderWidth &&
  bmBorderWidthValue &&
  bmPaddingTop &&
  bmPaddingRight &&
  bmPaddingBottom &&
  bmPaddingLeft &&
  bmPaddingTopValue &&
  bmPaddingRightValue &&
  bmPaddingBottomValue &&
  bmPaddingLeftValue &&
  bmMarginTop &&
  bmMarginRight &&
  bmMarginBottom &&
  bmMarginLeft &&
  bmMarginTopValue &&
  bmMarginRightValue &&
  bmMarginBottomValue &&
  bmMarginLeftValue &&
  boxModelResetBtn &&
  boxModelCssOut &&
  boxModelRules &&
  bmTotalOut;

if (ok) {
  const baseOuter = 150;

  const state = {
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    borderWidth: 5,
    boxSizing: "content-box",
  };

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function setActiveSizingChip(value) {
    boxModelRules
      .querySelectorAll("[data-bm-sizing]")
      .forEach((b) =>
        b.classList.toggle("is-active", b.dataset.bmSizing === value)
      );
  }

  function computeOuterSize() {
    const p = state.padding;
    const b = state.borderWidth;

    let outerW = baseOuter;
    let outerH = baseOuter;

    if (state.boxSizing === "content-box") {
      outerW = baseOuter + p.left + p.right + 2 * b;
      outerH = baseOuter + p.top + p.bottom + 2 * b;
    }

    return { outerW, outerH };
  }

  function computeTotalSize() {
    const m = state.margin;
    const { outerW, outerH } = computeOuterSize();

    const totalW = outerW + m.left + m.right;
    const totalH = outerH + m.top + m.bottom;

    return { totalW, totalH };
  }

  function applyLayout() {
    bmMarginEl.style.padding = `${state.margin.top}px ${state.margin.right}px ${state.margin.bottom}px ${state.margin.left}px`;
    bmBorderEl.style.padding = `${state.borderWidth}px`;
    bmPaddingEl.style.padding = `${state.padding.top}px ${state.padding.right}px ${state.padding.bottom}px ${state.padding.left}px`;

    const p = state.padding;
    const b = state.borderWidth;

    let contentW = baseOuter;
    let contentH = baseOuter;

    if (state.boxSizing === "border-box") {
      contentW = baseOuter - 2 * b - p.left - p.right;
      contentH = baseOuter - 2 * b - p.top - p.bottom;
      contentW = Math.max(20, contentW);
      contentH = Math.max(20, contentH);
    }

    bmContentEl.style.width = `${contentW}px`;
    bmContentEl.style.height = `${contentH}px`;
    bmContentEl.style.boxSizing = state.boxSizing;

    const { totalW, totalH } = computeTotalSize();
    bmTotalOut.textContent = `${Math.round(totalW)}px × ${Math.round(totalH)}px`;
  }

  function renderCSS() {
    const p = state.padding;
    const m = state.margin;

    const lines = [
      `  width: ${baseOuter}px;`,
      `  height: ${baseOuter}px;`,
      `  padding: ${p.top}px ${p.right}px ${p.bottom}px ${p.left}px;`,
      `  border: ${state.borderWidth}px solid black;`,
      `  margin: ${m.top}px ${m.right}px ${m.bottom}px ${m.left}px;`,
      `  box-sizing: ${state.boxSizing};`,
    ].join("\n");

    boxModelCssOut.textContent = `.box {\n${lines}\n}`;
  }

  function syncControls() {
    bmBorderWidth.value = String(state.borderWidth);
    bmBorderWidthValue.textContent = String(state.borderWidth);
    updateRangeFill(bmBorderWidth);

    bmPaddingTop.value = String(state.padding.top);
    bmPaddingRight.value = String(state.padding.right);
    bmPaddingBottom.value = String(state.padding.bottom);
    bmPaddingLeft.value = String(state.padding.left);
    bmPaddingTopValue.textContent = String(state.padding.top);
    bmPaddingRightValue.textContent = String(state.padding.right);
    bmPaddingBottomValue.textContent = String(state.padding.bottom);
    bmPaddingLeftValue.textContent = String(state.padding.left);
    updateRangeFill(bmPaddingTop);
    updateRangeFill(bmPaddingRight);
    updateRangeFill(bmPaddingBottom);
    updateRangeFill(bmPaddingLeft);

    bmMarginTop.value = String(state.margin.top);
    bmMarginRight.value = String(state.margin.right);
    bmMarginBottom.value = String(state.margin.bottom);
    bmMarginLeft.value = String(state.margin.left);
    bmMarginTopValue.textContent = String(state.margin.top);
    bmMarginRightValue.textContent = String(state.margin.right);
    bmMarginBottomValue.textContent = String(state.margin.bottom);
    bmMarginLeftValue.textContent = String(state.margin.left);
    updateRangeFill(bmMarginTop);
    updateRangeFill(bmMarginRight);
    updateRangeFill(bmMarginBottom);
    updateRangeFill(bmMarginLeft);

    setActiveSizingChip(state.boxSizing);
  }

  function applyAll() {
    applyLayout();
    renderCSS();
    syncControls();
  }

  function resetAll() {
    state.padding = { top: 20, right: 20, bottom: 20, left: 20 };
    state.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    state.borderWidth = 5;
    state.boxSizing = "content-box";
    applyAll();
  }

  bmBorderWidth.addEventListener("input", () => {
    state.borderWidth = clamp(Number(bmBorderWidth.value), 0, 80);
    applyAll();
  });

  bmPaddingTop.addEventListener("input", () => {
    state.padding.top = clamp(Number(bmPaddingTop.value), 0, 200);
    applyAll();
  });
  bmPaddingRight.addEventListener("input", () => {
    state.padding.right = clamp(Number(bmPaddingRight.value), 0, 200);
    applyAll();
  });
  bmPaddingBottom.addEventListener("input", () => {
    state.padding.bottom = clamp(Number(bmPaddingBottom.value), 0, 200);
    applyAll();
  });
  bmPaddingLeft.addEventListener("input", () => {
    state.padding.left = clamp(Number(bmPaddingLeft.value), 0, 200);
    applyAll();
  });

  bmMarginTop.addEventListener("input", () => {
    state.margin.top = clamp(Number(bmMarginTop.value), 0, 200);
    applyAll();
  });
  bmMarginRight.addEventListener("input", () => {
    state.margin.right = clamp(Number(bmMarginRight.value), 0, 200);
    applyAll();
  });
  bmMarginBottom.addEventListener("input", () => {
    state.margin.bottom = clamp(Number(bmMarginBottom.value), 0, 200);
    applyAll();
  });
  bmMarginLeft.addEventListener("input", () => {
    state.margin.left = clamp(Number(bmMarginLeft.value), 0, 200);
    applyAll();
  });

  boxModelRules.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-bm-sizing]");
    if (!btn) return;
    state.boxSizing =
      btn.dataset.bmSizing === "border-box" ? "border-box" : "content-box";
    applyAll();
  });

  boxModelResetBtn.addEventListener("click", resetAll);

  resetAll();
}
