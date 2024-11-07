import { type Compiler, CopyRspackPlugin } from "@rspack/core";
import { defineConfig } from "@rspack/cli";
import { exec } from "child_process";
import { watch } from "chokidar";

class RunCommandsPlugin {
    private static copyManifest(callback?: () => void): void {
        exec("npx tsx ./script/copyManifest.ts", (err, stdout) => {
            // eslint-disable-next-line no-console
            console.log("Copying manifest files...");
            if (err) {
                // eslint-disable-next-line no-console
                console.error(`Error: ${err.message}`);
            } else {
                // eslint-disable-next-line no-console
                console.log(stdout);
                // eslint-disable-next-line no-console
                console.log("Finished copying manifest files.");
                if (callback) {
                    callback();
                }
            }
        });
    }

    // eslint-disable-next-line class-methods-use-this
    public apply(compiler: Compiler): void {
        let isWatchMode = false;
        let isFirstRun = true;
        let manifestWatcher: ReturnType<typeof watch> | null = null;

        compiler.hooks.watchRun.tapAsync("RunCommandsPlugin", (_params, callback) => {
            isWatchMode = true;

            if (manifestWatcher) {
                callback();
                return;
            }

            manifestWatcher = watch("src/manifest/", {
                ignored: (pathString, stats) => Boolean(stats && stats.isFile() && !pathString.endsWith(".json"))
            });
            manifestWatcher.on("change", (pathString: string) => {
                // eslint-disable-next-line no-console
                console.log(`Manifest file changed: ${pathString}`);
                RunCommandsPlugin.copyManifest();
            });

            callback();
        });

        compiler.hooks.afterEmit.tapAsync("RunCommandsPlugin", (_compilation, callback) => {
            if (!isWatchMode || isFirstRun) {
                RunCommandsPlugin.copyManifest();
            }

            isFirstRun = false;

            exec("npx tsx ./script/addUserScriptComment.ts", (err, stdout) => {
                if (err) {
                    // eslint-disable-next-line no-console
                    console.error(`Error: ${err.message}`);
                } else {
                    // eslint-disable-next-line no-console
                    console.log(stdout);
                }
                callback();
            });
        });
    }
}

const isProduction = process.env.NODE_ENV === "production";
/* eslint-disable sort-keys */
const config = defineConfig({
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "source-map",
    entry: {
        "./chrome/js/index.js": "./src/ts/index.ts",
        "./firefox/js/index.js": "./src/ts/index.ts",
        "../index.user.js": "./src/ts/index.ts"
    },
    output: {
        filename: "[name]",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/u,
                exclude: [/node_modules/u],
                loader: "builtin:swc-loader",
                options: {
                    jsc: {
                        parser: {
                            syntax: "typescript"
                        }
                    }
                },
                type: "javascript/auto"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new RunCommandsPlugin(),
        new CopyRspackPlugin({
            patterns: [
                {
                    context: "./src/_locales/",
                    from: "**/*",
                    to: "chrome/_locales/"
                },
                {
                    context: "./src/_locales/",
                    from: "**/*",
                    to: "firefox/_locales/"
                },
                {
                    context: "./public/",
                    from: "**/*",
                    to: "chrome/"
                },
                {
                    context: "./public/",
                    from: "**/*",
                    to: "firefox/"
                }
            ]
        })
    ]
});
/* eslint-enable sort-keys */

export default config;
