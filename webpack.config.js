const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: {
      index: './src/scripts/index.js',
      detail: './src/scripts/detail.js',
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].js',
      publicPath: '/',
      clean: true,
    },

    module: {
      rules: [
        // 🔹 INDEX SCSS
        {
          test: /index\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss')('./tailwind.index.config.js'),
                    require('autoprefixer'),
                  ],
                },
              },
            },
            'sass-loader',
          ],
        },

        // 🔹 DETAIL SCSS
        {
          test: /detail\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss')('./tailwind.detail.config.js'),
                    require('autoprefixer'),
                  ],
                },
              },
            },
            'sass-loader',
          ],
        },

        // 🔹 PURE CSS (vendor vs)
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },

        // 🔹 PUG
        {
          test: /\.pug$/,
          use: ['pug-loader'],
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(),

      new HtmlWebpackPlugin({
        template: './src/views/pages/index.pug',
        filename: 'index.html',
        chunks: ['index'],
        minify: !isDevelopment,
      }),

      new HtmlWebpackPlugin({
        template: './src/views/pages/detail.pug',
        filename: 'detail.html',
        chunks: ['detail'],
        minify: !isDevelopment,
      }),

      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
    ],

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: false,
      port: 3000,
      open: true,
      hot: true,
      watchFiles: ['src/**/*'],
    },

    devtool: isDevelopment ? 'source-map' : false,
  };
};
