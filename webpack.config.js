//@ts-check

'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/** @type {import('webpack').Configuration} */
const extensionConfig = {
  target: 'node',
  mode: 'none',

  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: [
    {
      vscode: 'commonjs vscode'
    },
    function (context, request, callback) {
      if (
        request.startsWith('@bytecodealliance/preview2-shim') ||
        request.includes('rust_wasi')
      ) {
        return callback(null, request);
      }
      callback();
    }
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      path: false,
      fs: false
    },
    mainFields: ['module', 'main'], // Prefer the ESM "module" field
  },
  module: {
    rules: [
      // Process TypeScript files.
      {
        test: /\.(ts|mts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: { transpileOnly: true }
          }
        ]
      },
      // Include JavaScript files from wasi_modules.
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'wasi_modules'),
        ],
      },
      // Handle WASM files.
      {
        test: /\.wasm$/,
        type: 'asset/resource'
      }
    ]
  },
  experiments: {
    asyncWebAssembly: true,
    outputModule: false,
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: { level: 'log' },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'node_modules/@bytecodealliance/preview2-shim'),
          to: path.resolve(__dirname, 'dist/@bytecodealliance/preview2-shim'),
        },
      ],
    })
  ]
};

module.exports = [extensionConfig];
