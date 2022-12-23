import { execSync } from "child_process";
import manifest_v2 from "../manifest/v2.json" assert {type: "json"};
import manifest_v3 from "../manifest/v3.json" assert {type: "json"};
import fs from "fs";

manifest_v2.version = process.env.npm_package_version;
const manifest_v2_string = JSON.stringify(manifest_v2, null, 4);

manifest_v3.version = process.env.npm_package_version;
const manifest_v3_string = JSON.stringify(manifest_v3, null, 4);

fs.writeFileSync("./manifest.json", manifest_v2_string);
execSync('npx web-ext build --artifacts-dir "./web-ext-artifacts/manifest_v2" --ignore-files "./script/" "./node_modules/" "package.json" "package-lock.json" "./*.md" "./manifest/ "./web-ext-artifacts/""');

fs.writeFileSync("./manifest.json", manifest_v3_string);
execSync('npx web-ext build --artifacts-dir "./web-ext-artifacts/manifest_v3" --ignore-files "./script/" "./node_modules/" "package.json" "package-lock.json" "./*.md" "./manifest/ "./web-ext-artifacts/""');
