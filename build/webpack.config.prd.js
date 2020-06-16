const merge = require('webpack-merge')
const baseConf = require('./webpack.config.base')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve (dir) {
  return path.join(__dirname, '../', dir)
}
const env = process.env.NODE_ENV
module.exports = merge(baseConf({ NODE_ENV: env }), {
  mode: env,
  entry: './example/index.ts',
  output: {
    path: resolve('dist'),
    filename: 'index.js',
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash:8].js',
    libraryTarget: 'umd',
    library: 'QiankunVue'
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    },
    qiankun: {
      commonjs: 'qiankun',
      commonjs2: 'qiankun',
      amd: 'qiankun'
    }
  },
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    // 清理dist文件夹
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin()
  ]
})
