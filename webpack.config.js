const path = require("path");
const nodeExternals = require("webpack-node-externals");

const commonConfig = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
            ],
            plugins: ["babel-plugin-styled-components"],
          },
        },
        include: [path.resolve("src")],
      },
    ],
  },
};

module.exports = [
  {
    ...commonConfig,
    name: "server",
    target: "node",
    entry: "./src/server/index.js",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist/server"),
    },
    externals: [nodeExternals()],
  },
  {
    ...commonConfig,
    name: "client",
    target: "web",
    entry: "./src/client/index.js",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist/client"),
    },
  },
];
