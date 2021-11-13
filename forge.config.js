const {VueLoaderPlugin} = require('vue-loader')

module.exports = {
    plugins: [
        ['@electron-forge/plugin-webpack', {
            mainConfig: {
                entry: "./src/main.js",
                // devtool: 'nosources-source-map'
            },
            renderer: {
                entryPoints: [{
                    name: 'main_window',
                    html: './src/main/index.html',
                    js: './src/main/renderer.js',
                    preload: {js: "./src/main/preload.js"}
                }],
                config: {
                    module: {
                        rules: [
                            {test: /\.vue$/, loader: 'vue-loader'},
                            {test: /\.js$/, loader: 'babel-loader'},
                            {test: /\.css$/, use: ['vue-style-loader', 'css-loader']},
                            {test: /\.s[ac]ss$/i, use: ["style-loader", "css-loader", "sass-loader",],},
                        ]
                    },
                    plugins: [new VueLoaderPlugin()]
                }
            }
        }]
    ],
    packagerConfig: {},
    makers: [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "name": "hey_chat"
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": ["win32"]
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ]
}

