import { execSync } from "child_process";
import manifest_v2 from "../manifest/v2.json" assert {type: "json"};
import manifest_v3 from "../manifest/v3.json" assert {type: "json"};
import fs from "fs";

const ignore_files = '"./script/" "./node_modules/" "package.json" "package-lock.json" "./*.md" "index.user.js" "./manifest/ "./web-ext-artifacts/""';

manifest_v2.version = process.env.npm_package_version;
const manifest_v2_string = JSON.stringify(manifest_v2, null, 4);

manifest_v3.version = process.env.npm_package_version;
const manifest_v3_string = JSON.stringify(manifest_v3, null, 4);

fs.writeFileSync("./manifest.json", manifest_v2_string);
execSync(`npx web-ext build --artifacts-dir "./web-ext-artifacts/manifest_v2" --ignore-files ${ignore_files}`);

fs.writeFileSync("./manifest.json", manifest_v3_string);
execSync(`npx web-ext build --artifacts-dir "./web-ext-artifacts/manifest_v3" --ignore-files ${ignore_files}`);

const index_js = fs.readFileSync("./index.js", "utf-8");
const user_script_metadata = `// ==UserScript==
// @name         Hide View Count
// @namespace    https://github.com/Robot-Inventor/hide-view-count
// @version      ${process.env.npm_package_version}
// @description  This extension hides the number of impressions on Twitter and prevents the creation of an approval desire monster. It won't allow the View Count to be displayed for even a second!
// @author       Robot-Inventor (ろぼいん / @keita_roboin)
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @icon         https://raw.githubusercontent.com/Robot-Inventor/hide-view-count/main/image/icon512.png
// @downloadURL  https://raw.githubusercontent.com/Robot-Inventor/hide-view-count/main/index.user.js
// @updateURL    https://raw.githubusercontent.com/Robot-Inventor/hide-view-count/main/index.user.js
// @grant        none
// ==/UserScript==
`;
const user_script = user_script_metadata + index_js;
fs.writeFileSync("./index.user.js", user_script);
