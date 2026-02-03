const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const through2 = require('through2');
const postcss = require('postcss'); 

// Pug Task
function compilePug() {
  return gulp.src('src/views/pages/*.pug') 
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('dist'));
}

// SCSS + Sayfa Bazlı Tailwind Task
function compileStyles() {
  return gulp.src('src/styles/pages/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(through2.obj(function(file, enc, cb) {
      const fileName = file.stem; 
      
      // Cache temizleme (config değişikliklerinin anında yansıması için)
      delete require.cache[require.resolve('./tailwind.config.js')];
      const baseConfig = require('./tailwind.config.js');
      
      // Dinamik İçerik: Sadece bu sayfayı ve ortak alanları tarar
      const pageSpecificConfig = {
        ...baseConfig,
        content: [
          `./src/views/pages/${fileName}.pug`,
          "./src/views/partials/**/*.pug",
          "./src/views/layouts/**/*.pug",
          "./src/scripts/**/*.js"
        ]
      };

      // Manuel PostCSS İşlemi
      postcss([
        tailwindcss(pageSpecificConfig),
        autoprefixer()
      ])
      .process(file.contents.toString(), { from: file.path })
      .then(result => {
        file.contents = Buffer.from(result.css);
        cb(null, file);
      })
      .catch(err => {
        console.error('Hata Dosyası:', fileName, err.message);
        cb(err);
      });
    }))
    .pipe(gulp.dest('dist/css'));
}

// Watch Task
function watchFiles() {
  // Pug dosyası değiştiğinde hem HTML hem CSS güncellenmeli (yeni classlar için)
  gulp.watch('src/views/**/*.pug', gulp.series(compilePug, compileStyles)); 
  gulp.watch('src/styles/**/*.scss', compileStyles);
}

// Export Tasks
exports.pug = compilePug;
exports.styles = compileStyles;
exports.watch = gulp.series(compilePug, compileStyles, watchFiles);
exports.default = gulp.series(compilePug, compileStyles);