const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dotenv = require('dotenv').config({ path: `${__dirname}/.env` }).parsed;

module.exports = {
  target: 'web',

  entry: [
    'babel-polyfill',
    './src/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: dotenv.PUBLIC_PATH,
    filename: 'static/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    globalObject: 'this',
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    noEmitOnErrors: true,
  },

  watch: true,
  devtool: 'source-map',
  mode: 'development',

  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: dotenv.PUBLIC_PATH,
    port: 3000,
    inline: true,
    hotOnly: true,
    host: '0.0.0.0',
    proxy: {
      '/api': dotenv.API_HOST,
    },
    historyApiFallback: {
      index: dotenv.PUBLIC_PATH,
    },
  },

  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/[path][name].[ext]',
              context: 'src',
            },
          },
        ],
      },
      {
        test: /\.worker.js$/,
        use: {
          loader: 'worker-loader',
          options: { name: '[name].js' }
        }
      },
      {
        test: /\.sw.js$/,
        use: {
          loader: 'service-worker-loader',
          options: { filename: '[name].js' },
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
