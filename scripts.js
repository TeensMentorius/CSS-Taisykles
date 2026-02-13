const previewText = document.getElementById("previewText");
const cssOut = document.getElementById("cssOut");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");
const rulesWrap = document.getElementById("rules");

const state = {};

const cssToJs = {
  color: "color",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "letter-spacing": "letterSpacing",
  "text-transform": "textTransform",

  "font-family": "fontFamily",
  "text-align": "textAlign",
  "text-decoration": "textDecoration",
};

function renderCSS() {
  const lines = Object.entries(state)
    .map(([prop, val]) => `  ${prop}: ${val};`)
    .join("\n");

  cssOut.textContent = `.demo {\n${lines || ""}\n}`;
}

function applyPreview(prop, value) {
  const jsProp = cssToJs[prop];
  if (!jsProp) return;
  previewText.style[jsProp] = value;
}

function clearActiveChipsForProp(prop) {
  rulesWrap
    .querySelectorAll(`.chip[data-css="${prop}"]`)
    .forEach((btn) => btn.classList.remove("is-active"));
}

rulesWrap.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;

  const prop = btn.dataset.css;
  const value = btn.dataset.value;

  state[prop] = value;
  applyPreview(prop, value);

  clearActiveChipsForProp(prop);
  btn.classList.add("is-active");

  renderCSS();
});

function clearAll() {
  for (const key in state) delete state[key];

  previewText.removeAttribute("style");

  rulesWrap
    .querySelectorAll(".chip")
    .forEach((b) => b.classList.remove("is-active"));

  renderCSS();
}

resetBtn.addEventListener("click", () => {
  clearAll();
});

clearBtn.addEventListener("click", clearAll);

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(cssOut.textContent);
    copyBtn.textContent = "Nukopijuota!";
    setTimeout(() => (copyBtn.textContent = "Kopijuoti"), 900);
  } catch (err) {
    alert("Nepavyko nukopijuoti. Pažymėk tekstą ir nukopijuok ranka.");
  }
});

renderCSS();
