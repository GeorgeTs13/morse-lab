
"use strict";

const textInput = document.getElementById("text-input");
const morseInput = document.getElementById("morse-input");

const textCount = document.getElementById("text-count");
const morseCount = document.getElementById("morse-count");

const statusPanel = document.querySelector(".status-panel");
const statusMessage = document.getElementById("status-message");

let activeDirection = null;

/**
 * Show a status message and optionally mark it as a warning.
 */
function setStatus(message, warning = false) {
    statusMessage.textContent = message;
    statusPanel.classList.toggle("warning", warning);
}

/**
 * Count non-whitespace characters or Morse symbols.
 */
function updateCounts() {
    const textLength = textInput.value.length;
    const morseLength = Array.from(
        morseInput.value.replace(/\s/g, "")
    ).length;

    textCount.textContent =
        `${textLength} ${textLength === 1 ? "character" : "characters"}`;

    morseCount.textContent =
        `${morseLength} ${morseLength === 1 ? "symbol" : "symbols"}`;
}

/**
 * Translate the text field into Morse.
 */
function translateText() {
    activeDirection = "text";

    const result = encodeMorse(textInput.value);
    morseInput.value = result.morse;

    updateCounts();

    if (result.unsupported.length > 0) {
        setStatus(
            `Unsupported text characters skipped: ${result.unsupported.join(" ")}.`,
            true
        );
    } else if (textInput.value.trim()) {
        setStatus("Text translated successfully.");
    } else {
        setStatus("System ready. Start typing to translate.");
    }
}

/**
 * Translate the Morse field into text.
 */
function translateMorse() {
    activeDirection = "morse";

    const result = decodeMorse(morseInput.value);
    textInput.value = result.text;

    updateCounts();

    if (result.unknown.length > 0) {
        setStatus(
            `Unknown Morse sequences marked with �: ${result.unknown.join(", ")}.`,
            true
        );
    } else if (morseInput.value.trim()) {
        setStatus("Morse decoded successfully.");
    } else {
        setStatus("System ready. Start typing to translate.");
    }
}

// Only the field being edited drives translation.
// This avoids the two inputs continuously overwriting each other.
textInput.addEventListener("input", translateText);
morseInput.addEventListener("input", translateMorse);

document.getElementById("clear-text").addEventListener("click", () => {
    textInput.value = "";
    translateText();
    textInput.focus();
});

document.getElementById("clear-morse").addEventListener("click", () => {
    morseInput.value = "";
    translateMorse();
    morseInput.focus();
});

// Initialize counters and interface state.
updateCounts();
setStatus("System ready. Start typing to translate.");
