// ============================
// Elements
// ============================

const previewText = document.getElementById("previewText");
const cssOut = document.getElementById("cssOut");

const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");

const rulesWrap = document.getElementById("rules");

// Optional controls (exist only if you added them)
const colorPicker = document.getElementById("colorPicker");
const fontSizeSlider = document.getElementById("fontSizeSlider");
const fontSizeValue = document.getElementById("fontSizeValue");

// ============================
// State
// ============================

/**
 * Stores chosen CSS as: { "color": "#8c52ff", "font-size": "16px", ... }
 */
const state = {};

// Map CSS property name -> JS style property name
const cssToJs = {
  "color": "color",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "letter-spacing": "letterSpacing",
  "text-transform": "textTransform",
  "text-align": "textAlign",
  "text-decoration": "textDecoration",
};

// ============================
// Helpers
// ============================

function applyPreview(cssProp, cssValue) {
  const jsProp = cssToJs[cssProp];
  if (!jsProp) return;
  previewText.style[jsProp] = cssValue;
}

function renderCSS() {
  const lines = Object.entries(state)
    .map(([prop, val]) => `  ${prop}: ${val};`)
    .join("\n");

  cssOut.textContent = `.demo {\n${lines}\n}`;
}

function clearActiveChipsForProp(prop) {
  rulesWrap
    .querySelectorAll(`.chip[data-css="${prop}"]`)
    .forEach((btn) => btn.classList.remove("is-active"));
}

function setActiveChip(btn) {
  const prop = btn.dataset.css;
  clearActiveChipsForProp(prop);
  btn.classList.add("is-active");
}

// Attempts to sync UI controls (picker/slider) with chosen value
function syncControlsFromState(prop, value) {
  if (prop === "color" && colorPicker) {
    // color input supports hex only. If value isn't hex, skip.
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
      colorPicker.value = value;
    }
  }

  if (prop === "font-size" && fontSizeSlider && fontSizeValue) {
    const num = parseInt(value, 10);
    if (!Number.isNaN(num)) {
      fontSizeSlider.value = String(num);
      fontSizeValue.textContent = String(num);
    }
  }
}

function setProp(prop, value, { from = "unknown" } = {}) {
  state[prop] = value;
  applyPreview(prop, value);
  renderCSS();

  // If change came from picker/slider, make sure chips for that prop are not shown as active
  if (from === "control") {
    clearActiveChipsForProp(prop);
  }
}

// Resets preview and UI
function resetAll() {
  // Clear state
  for (const key in state) delete state[key];

  // Clear inline styles
  previewText.removeAttribute("style");

  // Clear active chips
  rulesWrap.querySelectorAll(".chip").forEach((b) => b.classList.remove("is-active"));

  // Reset controls to defaults (choose sensible defaults)
  if (colorPicker) colorPicker.value = "#8c52ff";
  if (fontSizeSlider) fontSizeSlider.value = "16";
  if (fontSizeValue) fontSizeValue.textContent = "16";

  // Render default CSS block (empty)
  cssOut.textContent = `.demo {\n\n}`;
}

// ============================
// Chips (click)
// ============================

rulesWrap.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;

  const prop = btn.dataset.css;
  const value = btn.dataset.value;

  setActiveChip(btn);
  setProp(prop, value, { from: "chip" });

  // Sync picker/slider if relevant
  syncControlsFromState(prop, value);
});

// ============================
// Color picker
// ============================

if (colorPicker) {
  colorPicker.addEventListener("input", () => {
    const value = colorPicker.value;
    setProp("color", value, { from: "control" });
  });
}

// ============================
// Font-size slider
// ============================

if (fontSizeSlider && fontSizeValue) {
  fontSizeSlider.addEventListener("input", () => {
    const px = fontSizeSlider.value;
    fontSizeValue.textContent = px;
    setProp("font-size", `${px}px`, { from: "control" });
  });
}

// ============================
// Buttons: copy / clear / reset
// ============================

copyBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(cssOut.textContent);
    const old = copyBtn.textContent;
    copyBtn.textContent = "Nukopijuota!";
    setTimeout(() => (copyBtn.textContent = old), 900);
  } catch {
    alert("Nepavyko nukopijuoti. Pažymėk kodą ir nukopijuok ranka.");
  }
});

clearBtn?.addEventListener("click", () => {
  // Clear generated CSS + preview styles but keep the UI controls at defaults
  resetAll();
});

resetBtn?.addEventListener("click", () => {
  // Same behavior as clear: avoid confusing two different resets
  resetAll();
});

// ============================
// Init
// ============================

resetAll();
