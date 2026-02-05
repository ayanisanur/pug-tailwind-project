// 🔧 WEBPACK YARDıMCı MODÜLLER
const path = require('path');                        // Dosya yolu işlemleri için
const HtmlWebpackPlugin = require('html-webpack-plugin');           // HTML dosyaları oluşturur
const MiniCssExtractPlugin = require('mini-css-extract-plugin');    // CSS'i ayrı dosyaya çıkarır
const { CleanWebpackPlugin } = require('clean-webpack-plugin');     // Her build'de dist/ klasörünü temizler
const CopyWebpackPlugin = require('copy-webpack-plugin');           // Statik dosyaları kopyalar (JSON, resim, vb.)

// 📦 WEBPACK YAPILANDIRMASI
module.exports = (env, argv) => {
  // Hangi modda çalışıyoruz? (development veya production)
  const isDevelopment = argv.mode === 'development';

  return {
    // 🎯 ENTRY POINTS (Giriş Noktaları)
    // Webpack bu dosyalardan başlayarak dependency graph oluşturur
    entry: {
      index: './src/scripts/index.js',   // index.js → index.html için
      detail: './src/scripts/detail.js', // detail.js → detail.html için
    },

    // 📤 OUTPUT (Çıktı Ayarları)
    output: {
      path: path.resolve(__dirname, 'dist'),  // Çıktı klasörü: dist/
      filename: 'js/[name].js',               // JS dosya ismi: index.js, detail.js ([name] = entry adı)
      publicPath: '/',                        // HTML'deki link/script yolları: /css/index.css, /js/index.js
      clean: true,                            // Her build'de dist/ klasörünü temizle
    },

    // 🔄 MODULE RULES (Dosya İşleme Kuralları)
    // Webpack her dosya türünü nasıl işleyeceğini buradan öğrenir
    module: {
      rules: [
        // 🟦 INDEX.SCSS için özel kural
        {
          test: /index\.scss$/,  // Sadece index.scss dosyasını yakala
          use: [
            // Loader'lar TERS SIRADA çalışır (en alttaki önce)
            MiniCssExtractPlugin.loader,  // 4. CSS'i ayrı dosyaya çıkar
            'css-loader',                 // 3. CSS'i JavaScript'e aktar
            {
              loader: 'postcss-loader',   // 2. PostCSS işle (Tailwind JIT burada)
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss')('./tailwind.index.config.js'),  // Index için Tailwind config
                    require('autoprefixer'),                               // Tarayıcı uyumluluğu
                  ],
                },
              },
            },
            'sass-loader',                // 1. SCSS → CSS'e çevir
          ],
        },

        // 🟥 DETAIL.SCSS için özel kural
        {
          test: /detail\.scss$/,  // Sadece detail.scss dosyasını yakala
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss')('./tailwind.detail.config.js'),  // Detail için Tailwind config
                    require('autoprefixer'),
                  ],
                },
              },
            },
            'sass-loader',
          ],
        },

        // 🟩 SADE CSS DOSYALARI (vendor CSS, normalize.css vb.)
        {
          test: /\.css$/,       // .css uzantılı tüm dosyalar
          use: [
            MiniCssExtractPlugin.loader,  // CSS'i ayrı dosyaya çıkar
            'css-loader',                 // CSS'i JavaScript'e aktar
          ],
        },

        // 🟨 PUG TEMPLATE'LERİ
        {
          test: /\.pug$/,       // .pug uzantılı tüm dosyalar
          use: ['pug-loader'],  // Pug → HTML'e çevir
        },
      ],
    },

    // 🔌 PLUGINS (Eklentiler)
    // Webpack'in temel işlevlerini genişletir
    plugins: [
      // 🧹 Her build'de dist/ klasörünü temizle
      new CleanWebpackPlugin(),

      // 📄 INDEX.HTML oluştur
      new HtmlWebpackPlugin({
        template: './src/views/pages/index.pug',  // Kaynak Pug dosyası
        filename: 'index.html',                   // Çıktı dosya adı
        chunks: ['index'],                        // SADECE index.js ve index.css'i ekle
        minify: !isDevelopment,                   // Production'da minify et
      }),

      // 📄 DETAIL.HTML oluştur
      new HtmlWebpackPlugin({
        template: './src/views/pages/detail.pug',
        filename: 'detail.html',
        chunks: ['detail'],                       // SADECE detail.js ve detail.css'i ekle
        minify: !isDevelopment,
      }),

      // 🎨 CSS DOSYALARINI AYRI ÇIKART
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',  // Çıktı: dist/css/index.css, dist/css/detail.css
      }),

      // 📋 STATİK DOSYALARI KOPYALA (JSON, resim, font vb.)
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/assets/api',     // Kaynak klasör
            to: 'js/api',               // Hedef: dist/js/api/
            noErrorOnMissing: true,     // Klasör yoksa hata verme
          },
          // İsterseniz diğer asset'leri de ekleyin:
          // {
          //   from: 'src/assets/images',
          //   to: 'images',
          //   noErrorOnMissing: true,
          // },
        ],
      }),
    ],

    // 🖥️ DEVELOPMENT SERVER AYARLARI
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),  // Sunulacak klasör
      },
      compress: false,       // Gzip sıkıştırma (false = daha hızlı)
      port: 3000,            // Sunucu portu: http://localhost:3000
      open: true,            // Tarayıcıyı otomatik aç
      hot: true,             // Hot Module Replacement (anlık güncelleme)
      watchFiles: ['src/**/*'],  // İzlenecek dosyalar (değişince yenile)
    },

    // 🐛 SOURCE MAP (Hata ayıklama için)
    // Development: Kaynak kodları göster
    // Production: Kaynak kodları gizle (güvenlik)
    devtool: isDevelopment ? 'source-map' : false,
  };
};
