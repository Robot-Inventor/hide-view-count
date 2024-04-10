import fs from "fs";
import packageJson from "../package.json";

const userScript = fs.readFileSync("./index.user.js", "utf8");
const user_script_metadata = `// ==UserScript==
// @name         Hide View Count
// @namespace    https://github.com/Robot-Inventor/hide-view-count
// @version      ${packageJson.version}
// @description  This extension hides the number of impressions on Twitter and prevents the creation of an approval desire monster. It won't allow the View Count to be displayed for even a second!
// @author       Robot-Inventor (ろぼいん / @keita_roboin)
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @icon         https://raw.githubusercontent.com/Robot-Inventor/hide-view-count/main/public/image/icon512.png
// @downloadURL  https://raw.githubusercontent.com/Robot-Inventor/hide-view-count/main/index.user.js
// @updateURL    https://raw.githubusercontent.com/Robot-Inventor/hide-view-count/main/index.user.js
// @grant        none
// ==/UserScript==
`;
const userScriptEdited = user_script_metadata + userScript;
fs.writeFileSync("./index.user.js", userScriptEdited);
