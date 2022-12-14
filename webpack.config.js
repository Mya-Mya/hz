const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool:"inline-source-map",
  devServer:{
    index:"main.html",
    port:8080,
    historyApiFallback:true
  },
  entry: path.resolve(__dirname, "src/main.ts"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    watchFiles: [path.join(__dirname, "src/*")],
    compress: true,
    host: "0.0.0.0",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/main.html")
    })
  ]
};