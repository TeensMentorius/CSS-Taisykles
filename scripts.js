(() => {
  const tabs = document.querySelectorAll(".topicTab");
  const panels = document.querySelectorAll(".topicPanel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.target;
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      panels.forEach((p) => p.classList.remove("is-active"));
      document.getElementById(targetId)?.classList.add("is-active");
    });
  });

  function updateRangeFill(rangeEl) {
    if (!rangeEl) return;
    const min = Number(rangeEl.min || 0);
    const max = Number(rangeEl.max || 100);
    const val = Number(rangeEl.value || 0);
    const p = max === min ? 0 : ((val - min) / (max - min)) * 100;
    rangeEl.style.setProperty("--p", `${p}%`);
  }

  const previewText = document.getElementById("previewText");
  const cssOut = document.getElementById("cssOut");
  const copyBtn = document.getElementById("copyBtn");
  const clearBtn = document.getElementById("clearBtn");
  const resetBtn = document.getElementById("resetBtn");
  const rulesWrap = document.getElementById("rules");
  const colorPicker = document.getElementById("colorPicker");
  const fontSizeSlider = document.getElementById("fontSizeSlider");
  const fontSizeValue = document.getElementById("fontSizeValue");

  const textState = {};
  const textCssToJs = {
    color: "color",
    "font-family": "fontFamily",
    "font-size": "fontSize",
    "font-weight": "fontWeight",
    "letter-spacing": "letterSpacing",
    "text-transform": "textTransform",
    "text-align": "textAlign",
    "text-decoration": "textDecoration",
  };

  function applyText(prop, value) {
    if (!previewText) return;
    const jsProp = textCssToJs[prop];
    if (!jsProp) return;
    previewText.style[jsProp] = value;
  }

  function renderTextCSS() {
    if (!cssOut) return;
    const lines = Object.entries(textState)
      .filter(([, v]) => v !== "" && v != null)
      .map(([p, v]) => `  ${p}: ${v};`)
      .join("\n");
    cssOut.textContent = `.demo {\n${lines}\n}`;
  }

  function clearActiveText(prop) {
    rulesWrap
      ?.querySelectorAll(`.chip[data-css="${prop}"]`)
      .forEach((b) => b.classList.remove("is-active"));
  }

  function resetText() {
    for (const k in textState) delete textState[k];
    previewText?.removeAttribute("style");
    rulesWrap
      ?.querySelectorAll(".chip")
      .forEach((b) => b.classList.remove("is-active"));

    if (colorPicker) colorPicker.value = "#8c52ff";
    if (fontSizeSlider) fontSizeSlider.value = "16";
    if (fontSizeValue) fontSizeValue.textContent = "16";
    updateRangeFill(fontSizeSlider);

    if (cssOut) cssOut.textContent = `.demo {\n\n}`;
  }

  rulesWrap?.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;

    const prop = btn.dataset.css;
    const value = btn.dataset.value;
    if (!prop || value == null) return;

    textState[prop] = value;
    applyText(prop, value);
    renderTextCSS();

    clearActiveText(prop);
    btn.classList.add("is-active");

    if (
      prop === "color" &&
      colorPicker &&
      /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
    ) {
      colorPicker.value = value;
    }

    if (prop === "font-size" && fontSizeSlider && fontSizeValue) {
      const num = parseInt(value, 10);
      if (!Number.isNaN(num)) {
        fontSizeSlider.value = String(num);
        fontSizeValue.textContent = String(num);
        updateRangeFill(fontSizeSlider);
      }
    }
  });

  colorPicker?.addEventListener("input", () => {
    const value = colorPicker.value;
    textState["color"] = value;
    applyText("color", value);
    renderTextCSS();
    clearActiveText("color");
  });

  fontSizeSlider?.addEventListener("input", () => {
    const px = fontSizeSlider.value;
    if (fontSizeValue) fontSizeValue.textContent = px;
    const value = `${px}px`;
    textState["font-size"] = value;
    applyText("font-size", value);
    renderTextCSS();
    clearActiveText("font-size");
    updateRangeFill(fontSizeSlider);
  });

  copyBtn?.addEventListener("click", async () => {
    if (!cssOut) return;
    try {
      await navigator.clipboard.writeText(cssOut.textContent);
    } catch {
      alert("Nepavyko nukopijuoti. Pažymėk kodą ir nukopijuok ranka.");
    }
  });

  clearBtn?.addEventListener("click", resetText);
  resetBtn?.addEventListener("click", resetText);

  if (previewText && cssOut) resetText();

  const previewBox = document.getElementById("previewBox");
  const boxCssOut = document.getElementById("boxCssOut");
  const boxResetBtn = document.getElementById("boxResetBtn");
  const boxRulesWrap = document.getElementById("boxRules");

  const boxWidthInput = document.getElementById("boxWidthInput");
  const boxHeightInput = document.getElementById("boxHeightInput");
  const boxWidthUnit = document.getElementById("boxWidthUnit");
  const boxHeightUnit = document.getElementById("boxHeightUnit");

  const boxBgPicker = document.getElementById("boxBgPicker");
  const boxBorderWidth = document.getElementById("boxBorderWidth");
  const boxBorderWidthValue = document.getElementById("boxBorderWidthValue");
  const boxBorderColor = document.getElementById("boxBorderColor");
  const boxOpacity = document.getElementById("boxOpacity");
  const boxOpacityValue = document.getElementById("boxOpacityValue");

  const boxState = {};
  let currentBorderStyle = "solid";
  let currentBorderColor = "#000000";

  function renderBoxCSS() {
    if (!boxCssOut) return;
    const lines = Object.entries(boxState)
      .filter(([, v]) => v !== "" && v != null)
      .map(([p, v]) => `  ${p}: ${v};`)
      .join("\n");
    boxCssOut.textContent = `.box {\n${lines}\n}`;
  }

  function clearActiveBox(prop) {
    boxRulesWrap
      ?.querySelectorAll(`.chip[data-css="${prop}"]`)
      .forEach((b) => b.classList.remove("is-active"));
  }

  function clearActiveBorderStyle() {
    boxRulesWrap
      ?.querySelectorAll("[data-border-style]")
      .forEach((b) => b.classList.remove("is-active"));
  }

  function setBorderFromControls() {
    if (!previewBox) return;
    const w = boxBorderWidth ? Number(boxBorderWidth.value || 0) : 0;
    const borderValue = `${w}px ${currentBorderStyle} ${currentBorderColor}`;
    previewBox.style.border = borderValue;
    boxState["border"] = borderValue;
    renderBoxCSS();
  }

  function getWidthUnit() {
    return boxWidthUnit?.value || "px";
  }

  function getHeightUnit() {
    return boxHeightUnit?.value || "px";
  }

  function updateBoxWidth() {
    if (!previewBox || !boxWidthInput) return;
    const n = Number(boxWidthInput.value);
    if (Number.isNaN(n)) return;
    const value = `${n}${getWidthUnit()}`;
    previewBox.style.width = value;
    boxState["width"] = value;
    renderBoxCSS();
  }

  function updateBoxHeight() {
    if (!previewBox || !boxHeightInput) return;
    const n = Number(boxHeightInput.value);
    if (Number.isNaN(n)) return;
    const value = `${n}${getHeightUnit()}`;
    previewBox.style.height = value;
    boxState["height"] = value;
    renderBoxCSS();
  }

  function applyBoxProp(prop, value) {
    if (!previewBox) return;
    if (prop === "background-color") previewBox.style.backgroundColor = value;
    else if (prop === "border-radius") previewBox.style.borderRadius = value;
    else if (prop === "box-shadow") previewBox.style.boxShadow = value;
    else previewBox.style[prop] = value;
  }

  function resetBox() {
    if (!previewBox || !boxCssOut) return;

    currentBorderStyle = "solid";
    currentBorderColor = "#000000";

    if (boxWidthUnit) boxWidthUnit.value = "px";
    if (boxHeightUnit) boxHeightUnit.value = "px";
    if (boxWidthInput) boxWidthInput.value = "150";
    if (boxHeightInput) boxHeightInput.value = "150";

    boxState["width"] = `150${getWidthUnit()}`;
    boxState["height"] = `150${getHeightUnit()}`;
    boxState["background-color"] = "#8c52ff";
    boxState["border-radius"] = "8px";
    boxState["box-shadow"] = "";
    boxState["opacity"] = "1";

    previewBox.style.width = boxState["width"];
    previewBox.style.height = boxState["height"];
    previewBox.style.backgroundColor = boxState["background-color"];
    previewBox.style.borderRadius = boxState["border-radius"];
    previewBox.style.boxShadow = boxState["box-shadow"];
    previewBox.style.opacity = boxState["opacity"];

    if (boxBgPicker) boxBgPicker.value = "#8c52ff";

    if (boxBorderColor) boxBorderColor.value = "#000000";
    if (boxBorderWidth) boxBorderWidth.value = "0";
    if (boxBorderWidthValue) boxBorderWidthValue.textContent = "0";
    updateRangeFill(boxBorderWidth);

    if (boxOpacity) boxOpacity.value = "1";
    if (boxOpacityValue) boxOpacityValue.textContent = "1";
    updateRangeFill(boxOpacity);

    boxRulesWrap
      ?.querySelectorAll(".chip")
      .forEach((b) => b.classList.remove("is-active"));
    clearActiveBorderStyle();

    setBorderFromControls();
    renderBoxCSS();
  }

  boxWidthInput?.addEventListener("input", updateBoxWidth);
  boxWidthUnit?.addEventListener("change", updateBoxWidth);

  boxHeightInput?.addEventListener("input", updateBoxHeight);
  boxHeightUnit?.addEventListener("change", updateBoxHeight);

  boxBgPicker?.addEventListener("input", () => {
    const value = boxBgPicker.value;
    boxState["background-color"] = value;
    applyBoxProp("background-color", value);
    renderBoxCSS();
  });

  boxBorderColor?.addEventListener("input", () => {
    currentBorderColor = boxBorderColor.value;
    setBorderFromControls();
  });

  boxBorderWidth?.addEventListener("input", () => {
    const width = boxBorderWidth.value;
    if (boxBorderWidthValue) boxBorderWidthValue.textContent = width;
    updateRangeFill(boxBorderWidth);
    setBorderFromControls();
  });

  boxOpacity?.addEventListener("input", () => {
    const value = boxOpacity.value;
    if (boxOpacityValue) boxOpacityValue.textContent = value;
    updateRangeFill(boxOpacity);
    boxState["opacity"] = value;
    applyBoxProp("opacity", value);
    renderBoxCSS();
  });

  boxRulesWrap?.addEventListener("click", (e) => {
    const styleBtn = e.target.closest("[data-border-style]");
    if (styleBtn) {
      currentBorderStyle = styleBtn.dataset.borderStyle || "solid";
      clearActiveBorderStyle();
      styleBtn.classList.add("is-active");
      setBorderFromControls();
      return;
    }

    const chip = e.target.closest(".chip");
    if (!chip) return;

    const prop = chip.dataset.css;
    const value = chip.dataset.value;
    if (!prop || value == null) return;

    boxState[prop] = value;
    applyBoxProp(prop, value);
    renderBoxCSS();

    clearActiveBox(prop);
    chip.classList.add("is-active");
  });

  boxResetBtn?.addEventListener("click", resetBox);

  if (previewBox && boxCssOut) resetBox();
})();
