const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, '../', dir)
}

module.exports = (env, argv) => {
  return {
    resolve: {
      alias: {
        '@': resolve('example'),
        src: resolve('src'),
        // vue$: 'vue/dist/vue.runtime.esm.js'
      },
      extensions: [
        '.tsx',
        '.ts',
        '.mjs',
        '.js',
        '.jsx',
        '.vue',
        '.json',
        '.wasm'
      ],
      modules: [
        'node_modules'
        // resolve('node_modules/@vue/cli-service/node_modules'),
        // resolve('node_modules/@vue/cli-plugin-babel/node_modules'),
        // resolve('node_modules/@vue/cli-plugin-typescript/node_modules')
      ]
    },
    module: {
      rules: [
        // 预处理.vue文件
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        // 预处理.ts文件
        /*{
          test: /\.tsx?$/,
          use: [
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
                happyPackMode: env.NODE_ENV !== 'production', // 生产模式下false,不开启
                transpileOnly: env.NODE_ENV !== 'production' // 生产环境下关闭增量构建
              }
            }
          ],
          exclude: /node_modules/
        },*/
        // 预处理scss
        {
          test: /\.s[ac]ss$/,
          use: [
            env.NODE_ENV !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        // 预处理css
        {
          test: /\.css$/,
          use: [
            env.NODE_ENV !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        // 预处理图片
        {
          test: /\.(svg|otf|ttf|woff2?|eot|png|jpe?g|gif|webp)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 4096,
            esModule: false, // 5.0版本以上要加
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash:8].[ext]'
              }
            }
          }
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(), // 配合vue-loader
      // new ForkTsCheckerWebpackPlugin({
      //   checkSyntacticErrors: true
      // }), // 将ts-loader类型检查跑在一个独立线程加速编译
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"' + env.NODE_ENV + '"',
          BASE_URL: '"/"'
        }
      }), // 给浏览器代码中添加全局变量
      new FriendlyErrorsPlugin(), // 友好的错误提示
      new MiniCssExtractPlugin(), // css提取
      new CaseSensitivePathsPlugin() // 严格路径大小写
    ]
  }
}
