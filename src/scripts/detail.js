let sideCurrentIndex = 0;
let sideTimer;
const sideTitles = [
  "Erdoğan'dan 2025'te kıtaları aşan liderlik diplomasisi",
  "İBB'den iş insanlarına yetim hakkıyla fuhuş skandalı",
  "A Haber Süleyman Şah'ın ilk defnedildiği yerde"
];

function updateSideSlider() {
  const slidesContainer = document.querySelector('.side-slides-container');
  const dots = document.querySelectorAll('.side-dot');
  const titleElement = document.getElementById('side-current-title');
  if (slidesContainer) slidesContainer.style.transform = 'translateX(-' + (sideCurrentIndex * 100) + '%)';
  if (titleElement) titleElement.textContent = sideTitles[sideCurrentIndex];
  dots.forEach(function(dot, i) {
    if (i === sideCurrentIndex) {
      dot.className = "side-dot w-3 h-3 bg-[#a80000] opacity-100 rounded-full transition-all border-none";
    } else {
      dot.className = "side-dot w-3 h-3 bg-[#8B8B9F] opacity-100 rounded-full transition-all hover:bg-gray-400 border-none";
    }
  });
}

window.moveSideSlide = function(n) {
  const slides = document.querySelectorAll('.side-slide-item');
  if (slides.length > 0) {
    sideCurrentIndex = (sideCurrentIndex + n + slides.length) % slides.length;
    updateSideSlider();
    startSideAutoPlay();
  }
};

window.goToSideSlide = function(index) {
  sideCurrentIndex = index;
  updateSideSlider();
  startSideAutoPlay();
};

function startSideAutoPlay() {
  clearInterval(sideTimer);
  sideTimer = setInterval(function() {
    window.moveSideSlide(1);
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
  updateSideSlider();
  startSideAutoPlay();
});




const panel=document.getElementById('article-share-panel');
const openBtn=document.getElementById('share-btn');
const closeBtn=document.getElementById('panel-close-btn');
openBtn.addEventListener('click' , (e) =>{
    e.preventDefault(); 
    panel.classList.remove('hidden');       
});
    closeBtn.addEventListener('click' , (e) =>{
    e.preventDefault();
    panel.classList.add('hidden');       
});


