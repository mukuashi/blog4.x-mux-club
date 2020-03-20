const path = require("path");
const resolvePath = file => path.resolve(__dirname, file);
const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./webpack.base.config");
const SWPrecachePlugin = require("sw-precache-webpack-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

const plugins = [
  // strip dev-only code in Vue source
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
    "process.env.VUE_ENV": '"client"'
  }),
  new MiniCssExtractPlugin({
    filename: "css/[name].[chunkhash:7].css",
    chunkFilename: "css/[name].[chunkhash:7].css"
  }),
  new VueSSRClientPlugin()
];
if (isProd) {
  plugins.push(
    new SWPrecachePlugin({
      cacheId: "vue-hn",
      filename: "service-worker.js",
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: "/",
          handler: "networkFirst"
        },
        {
          urlPattern: /\/(top|new|show|ask|jobs)/,
          handler: "networkFirst"
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: resolvePath("../src/index.template.html"),
      filename: "./index.html",
      inlineSource: ".js$",
      inject: "head" //https://juejin.im/post/5ce96ad7e51d455a2f2201e1
    })
  );
}
const config = merge(base, {
  entry: {
    app: isProd
      ? ["@babel/polyfill", resolvePath("../src/entry-client.js")]
      : resolvePath("../src/entry-client.js")
  },
  optimization: {
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      chunks: "initial",
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        },
        vendor: {
          name: "vendor",
          test(module) {
            // a module is extracted into the vendor chunk if...
            return (
              // it's inside node_modules
              /node_modules/.test(module.context) &&
              // and not a CSS file
              !/\.css$/.test(module.request)
            );
          }
        }
      }
    }
  },
  plugins
});

module.exports = config;
