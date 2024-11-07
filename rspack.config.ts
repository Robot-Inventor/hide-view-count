import { exec } from "child_process";
import chokidar from "chokidar";
import { CopyRspackPlugin, type Compiler } from "@rspack/core";
import { defineConfig } from "@rspack/cli";

class RunCommandsPlugin {
    private static copyManifest(callback?: () => void) {
        exec("npx tsx ./script/copyManifest.ts", (err, stdout) => {
            if (err) {
                console.error(`Error: ${err}`);
            } else {
                console.log(stdout);
                if (callback) {
                    callback();
                }
            }
        });
    }

    public apply(compiler: Compiler) {
        let manifestWatcher;
        let isWatchMode = false;

        compiler.hooks.watchRun.tapAsync("RunCommandsPlugin", (_params, callback) => {
            isWatchMode = true;
            if (!manifestWatcher) {
                manifestWatcher = chokidar.watch("src/manifest/", {
                    ignored: (pathString, stats) => Boolean(stats && stats.isFile() && !pathString.endsWith(".json"))
                });
                manifestWatcher.on("change", (path) => {
                    console.log(`Manifest file changed: ${path}`);
                    RunCommandsPlugin.copyManifest();
                });

                RunCommandsPlugin.copyManifest(callback);
            } else {
                callback();
            }
        });

        compiler.hooks.afterEmit.tapAsync("RunCommandsPlugin", (_compilation, callback) => {
            RunCommandsPlugin.copyManifest();

            exec("npx tsx ./script/addUserScriptComment.ts", (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error: ${err}`);
                } else {
                    console.log(stdout);
                }
                callback();
            });
        });
    }
}

const isProduction = process.env.NODE_ENV === "production";
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
                test: /\.ts$/,
                use: "ts-loader"
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

export default config;
