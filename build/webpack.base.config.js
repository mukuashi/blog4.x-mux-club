const path = require("path");
const webpack = require("webpack");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const postcssConfig = require("./postcss.config");

const isProd = process.env.NODE_ENV === "production";

const plugins = [
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    "process.env.VUE_BASE_URL": JSON.stringify(process.env.VUE_BASE_URL)
  })
];
if (!isProd) {
  plugins.push(new FriendlyErrorsPlugin());
}

module.exports = {
  stats: {
    // http://webpack.docschina.org/configuration/stats/
    entrypoints: false,
    children: false
  },
  mode: isProd ? "production" : "development",
  devtool: isProd ? false : "#cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "../public"),
    publicPath: "/", // code source目录或CDN地址
    filename: "js/[name].[chunkhash:5].js",
    chunkFilename: "js/[name].[chunkhash:5].js"
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      public: path.resolve(__dirname, "../public")
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: "eslint-loader",
        enforce: "pre",
        include: [path.resolve(__dirname, "../src")],
        options: {
          formatter: require("eslint-friendly-formatter")
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          extractCSS: true,
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "img/[name].[hash:7].[ext]"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "fonts/[name].[hash:7].[ext]"
        }
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          isProd
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: true
                }
              }
            : "vue-style-loader",
          "css-loader",
          postcssConfig,
          "less-loader",
          {
            loader: "style-resources-loader",
            options: {
              patterns: [
                path.resolve(__dirname, "../src/styles/mixin.less"),
                path.resolve(__dirname, "../src/styles/animate.less")
              ],
              injector: "append"
            }
          }
        ]
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? "warning" : false
  },
  optimization: {
    minimizer: isProd
      ? [
          // 压缩 js
          new UglifyJsPlugin({
            uglifyOptions: {
              warnings: false,
              compress: {
                drop_console: false, // 打包后去除console.log
                collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
                pure_funcs: ["console.log"]
              }
            },
            sourceMap: false,
            parallel: true // 使用多进程并行运行来提高构建速度
          })
        ]
      : []
  },
  plugins
};
