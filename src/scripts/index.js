import '../styles/pages/index.scss';
let currentIndex = 0;
let timer;

function updateSlider() {
  const slidesContainer = document.querySelector('.slides-container');
  const dots = document.querySelectorAll('.dot');

  slidesContainer.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

  dots.forEach(function(dot, i) {
    if (i === currentIndex) {
      dot.className = "dot bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center transition-all w-8 h-8 border-none";
      dot.innerHTML = '<span class="font-extrabold text-sm">' + (i + 1) + '</span>';
    } else {
      dot.className = "dot w-3 h-3 opacity-100 rounded-full transition-all bg-color-pagination border-none";
      dot.innerHTML = "";
    }
  });
}

window.moveSlide = function(n) {
  const slides = document.querySelectorAll('.slide-item');
  currentIndex = (currentIndex + n + slides.length) % slides.length;
  updateSlider();
  startAutoPlay();
};

window.goToSlide = function(index) {
  currentIndex = index;
  updateSlider();
  startAutoPlay();
};

function startAutoPlay() {
  clearInterval(timer);
  timer = setInterval(function() {
    window.moveSlide(1);
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
  updateSlider();
  startAutoPlay();
});

