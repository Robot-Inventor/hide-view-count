const { exec } = require("child_process");
const CopyFilePlugin = require("copy-webpack-plugin");

class RunCommandsPlugin {
    updateManifest() {
        exec("npx ts-node ./script/copyManifest.ts", (err, stdout, stderr) => {
            if (err) {
                console.error(`Error: ${err}`);
            } else {
                console.log(stdout);
            }
        });
    }

    apply(compiler) {
        let manifestWatcher;
        let isWatchMode = false;

        compiler.hooks.watchRun.tapAsync("RunCommandsPlugin", (params, callback) => {
            isWatchMode = true;
            if (!manifestWatcher) {
                manifestWatcher = chokidar.watch("src/manifest/**/*.json");
                manifestWatcher.on("change", (path) => {
                    console.log(`Manifest file changed: ${path}`);
                    this.updateManifest();
                });

                this.updateManifest();
            } else {
                callback();
            }
        });

        compiler.hooks.afterEmit.tapAsync("RunCommandsPlugin", (compilation, callback) => {
            this.updateManifest();
        });
    }
}

module.exports = {
    mode: "production",
    entry: {
        "./chrome/js/index.js": "./src/ts/index.ts",
        "./firefox/js/index.js": "./src/ts/index.ts"
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
        new CopyFilePlugin({
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
};
