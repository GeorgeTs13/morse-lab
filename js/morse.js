
"use strict";

// International Morse code mappings for letters, digits, and punctuation.
const MORSE_CODE = Object.freeze({
    A: ".-",    B: "-...",  C: "-.-.",  D: "-..",
    E: ".",     F: "..-.",  G: "--.",   H: "....",
    I: "..",    J: ".---",  K: "-.-",   L: ".-..",
    M: "--",    N: "-.",    O: "---",   P: ".--.",
    Q: "--.-",  R: ".-.",   S: "...",   T: "-",
    U: "..-",   V: "...-",  W: ".--",   X: "-..-",
    Y: "-.--",  Z: "--..",

    "0": "-----", "1": ".----", "2": "..---",
    "3": "...--", "4": "....-", "5": ".....",
    "6": "-....", "7": "--...", "8": "---..",
    "9": "----.",

    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    "_": "..--.-",
    '"': ".-..-.",
    "$": "...-..-",
    "@": ".--.-."
});

// Reverse lookup table: Morse signal -> character.
const REVERSE_MORSE = Object.freeze(
    Object.fromEntries(
        Object.entries(MORSE_CODE).map(([character, signal]) => [
            signal,
            character
        ])
    )
);

/**
 * Convert text to Morse code.
 *
 * Letters are separated by spaces.
 * Words are separated by " / ".
 * Unsupported characters are skipped and reported separately.
 */
function encodeMorse(text) {
    const words = String(text).toUpperCase().trim().split(/\s+/);
    const unsupported = [];

    if (!String(text).trim()) {
        return { morse: "", unsupported };
    }

    const encodedWords = words.map(word => {
        return Array.from(word)
            .map(character => {
                if (MORSE_CODE[character]) {
                    return MORSE_CODE[character];
                }

                unsupported.push(character);
                return null;
            })
            .filter(Boolean)
            .join(" ");
    }).filter(Boolean);

    return {
        morse: encodedWords.join(" / "),
        unsupported: [...new Set(unsupported)]
    };
}

/**
 * Convert Morse code to text.
 *
 * Spaces separate letters.
 * "/" separates words.
 * Unknown Morse tokens are reported rather than silently decoded.
 */
function decodeMorse(input) {
    const source = String(input).trim();

    if (!source) {
        return { text: "", unknown: [] };
    }

    const unknown = [];

    const words = source.split(/\s*\/\s*/);

    const decodedWords = words.map(word => {
        if (!word.trim()) {
            return "";
        }

        return word.trim().split(/\s+/).map(signal => {
            if (REVERSE_MORSE[signal]) {
                return REVERSE_MORSE[signal];
            }

            unknown.push(signal);
            return "�";
        }).join("");
    });

    return {
        text: decodedWords.join(" "),
        unknown: [...new Set(unknown)]
    };
}
