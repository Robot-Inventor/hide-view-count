import fs from "fs";
import manifestV2 from "../src/manifest/v2.json";
import manifestV3 from "../src/manifest/v3.json";
import packageJson from "../package.json";

const JSON_INDENT = 4;

manifestV2.version = packageJson.version;
manifestV3.version = packageJson.version;

const manifestV2Text = JSON.stringify(manifestV2, null, JSON_INDENT);
const manifestV3Text = JSON.stringify(manifestV3, null, JSON_INDENT);

fs.writeFileSync("./dist/firefox/manifest.json", manifestV2Text);
fs.writeFileSync("./dist/chrome/manifest.json", manifestV3Text);
