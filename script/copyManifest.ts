import manifestV2 from "../src/manifest/v2.json";
import manifestV3 from "../src/manifest/v3.json";
import packageJson from "../package.json";
import fs from "fs";

manifestV2.version = packageJson.version;
manifestV3.version = packageJson.version;

const manifestV2Text = JSON.stringify(manifestV2, null, 4);
const manifestV3Text = JSON.stringify(manifestV3, null, 4);

fs.writeFileSync("./dist/firefox/manifest.json", manifestV2Text);
fs.writeFileSync("./dist/chrome/manifest.json", manifestV3Text);
