const merge = require('webpack-merge')
const baseConf = require('./webpack.config.base')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '../', dir)
}
const env = process.env.NODE_ENV // 获取全局环境变量

module.exports = merge(baseConf({ NODE_ENV: env }), {
  mode: env,
  entry: './example/main.js',
  output: {
    path: resolve('dist'),
    filename: 'app.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: resolve('dist'),
    port: 8080,
    hot: true,
    progress: true,
    quiet: true,
    historyApiFallback: true,
    overlay: {
      errors: true
    }
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      // 开发环境进行eslint规则校验
      {
        enforce: 'pre',
        test: /\.(vue|(j|t)sx?)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 支持热模块替换
    new HtmlWebpackPlugin({
      title: 'element3.0-alpha',
      template: resolve('public/index.html'),
      favicon: resolve('public/favicon.ico')
    }), // 配置index.html模板
    new CopyWebpackPlugin([
      {
        from: resolve('public'),
        to: resolve('dist'),
        toType: 'dir',
        ignore: ['index.html']
      }
    ]) // 拷贝插件，用于拷贝一些不参与打包的静态资源至dist目录
  ]
})
