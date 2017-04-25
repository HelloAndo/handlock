/**   
 * todo 
 * 1. js files imported automatically
 * 2. excute multi index pages with hotReplacement
 */


const webpack = require('webpack')
const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require("./node_modules/webpack/lib/optimize/CommonsChunkPlugin.js");
const fs = require('fs')

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 9000
  },
  entry: {
    // vendor: ['jquery', 'bootstrap'],
    app: ['webpack-hot-middleware/client?reload=true', './app/js/main.js'],
    // app2: './app/js/main2.js'
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        query: {
          minimize: true
        }
        // loader: 'file-loader?name=[path][name].[ext]!extract-loader!html-loader'
      },
      {
        test: /\.(png|gif|jpg)$/,
        loader: 'url-loader?limit=1'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // 不加上exclude容易报错
        exclude: /node_modules/,
        // query: {
        //   presets: ['es2015', 'stage-0', 'stage-3', 'stage-2'],
        //   plugins: ['transform-runtime']
        // }
      }
    ]
  },
  plugins: [
    // html文件生成插件
    new HtmlWebpackPlugin({
      title: 'my-webpack2-demo',
      filename: 'index.html',
      template: './index.html',
      inject: 'body'
    }),
    // 抽离公用模块
    new CommonsChunkPlugin('init.js'),
    // 抽离公用第三方模块
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   filename: 'vendor.bundle.js'
    // }),
    // 全部模块自动引用
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    // 热替换
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: '#source-map'
}