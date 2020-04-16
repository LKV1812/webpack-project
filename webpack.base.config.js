const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
// const pages = fs.readdirSync(path.resolve(__dirname, '../src')).filter(fileName => fileName.endsWith('.html'));

const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
  assets: 'assets/'
};

const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    app: `${PATHS.src}/js`,
    somefile: `${PATHS.src}/js/some.js`
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "pug-loader",
      }, {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/"
      }, {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: "file-loader",
        options: {name: '[name].[ext]'}
      }, {
        test:/\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {name: '[name].[ext]'}
      }, {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: {sourceMap: true} },
          { loader: 'postcss-loader', options: {sourceMap: true, config: {path: `${PATHS.src}/postcss.config.js`}}},
          { loader: 'sass-loader', options: {sourceMap: true} },
        ],
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: {sourceMap: true}},
          { loader: 'postcss-loader', options: {sourceMap: true, config: {path: `${PATHS.src}/postcss.config.js`}}},
        ]
      },
    ]
  },
  resolve: {
    alias: {
      '~': 'src'
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[contenthash].css`
    }),
    // new HtmlWebpackPlugin({
    //   template: `${PATHS.src}/index.html`,
    //   filename: './index.html',
    // }),
    // ...pages.map(page => new HtmlWebpackPlugin({
    //   template: `${PATHS.src}/${page}`,
    //   filename: `./${page}`
    //  })),
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`
    })),
    new CopyWebpackPlugin([
      {from: `${PATHS.src}/img`, to: `${PATHS.assets}img`},
      {from: `${PATHS.src}/fonts`, to: `${PATHS.assets}fonts`}
    ])
  ],
};
