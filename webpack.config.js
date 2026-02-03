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
      clean: true,  // ← true yap (eski dosyalar temizlensin)
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: ['pug-loader'],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,  // ← style-loader kaldır
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,  // ← style-loader kaldır
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),  // ← Geri ekle
      
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
      compress: true,
      port: 3000,
      hot: true,
      open: true,
      watchFiles: ['src/**/*'],
      liveReload: true,  // ← Ekle
    },
    devtool: isDevelopment ? 'source-map' : false,
  };
};