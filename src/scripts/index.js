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


const CONFIG = {
  loadMoreOffset: 700,
  maxPage:5
};


let currentPage = 1;
let isLoading = false;
let hasMore = true;

   //FETCH (HER PAGE AYRI)

const fetchCategoryPostList = async (page) => {
  if (isLoading || !hasMore) return;
  if(currentPage>CONFIG.maxPage){
    hasMore=false;
    return;
  }
  isLoading = true;

  try {
    const response = await fetch(
      `/js/api/category-post-list.json?page=${currentPage}`
    );

    if (!response.ok) {
      throw new Error('Kategori verisi alınamadı');
    }

    const data = await response.json();
    const newsList = data.data.news.data;


    if (newsList.length === 0) {
      hasMore = false;
      isLoading = false;
      return;
    }

    renderNews(newsList);
    currentPage++;

  } catch (error) {
    console.error('Fetch hatası:', error);
    showError('Haberler yüklenemedi');
  } finally {
    isLoading = false;
  }
 

};
   //DOM'A HABER BAS

const renderNews = (newsArray) => {
  const container = document.querySelector('.news-infinite .grid');
  if (!container) return;

  newsArray.forEach((news) => {
    const card = document.createElement('div');
    card.className =
      'flex rounded-sm border overflow-hidden border-solid border-mist bg-white';

    card.innerHTML = `
      <figure class="flex flex-col m-0 p-0">
        <div class="news-img w-full overflow-hidden m-0 h-[140px] sm:h-[207px] md:h-[115px] lg:h-[160px]">
          <a class="no-underline" href="${news.url || '#'}">
            <img 
              src="${news.image.path}" 
              alt="${news.title}" 
              loading="lazy" 
              class="news-card-image w-full h-full object-cover" 
              width="${news.image.width}" 
              height="${news.image.height}"
            >
          </a>
        </div>
        <figcaption class="flex flex-col gap-2 m-0 p-3 md:p-4">
          <a class="no-underline color-dark flex flex-col gap-5 hover:brand-red" href="${news.url || '#'}">
            <span class="font-bold text-base line-clamp-2 leading-snug">
              ${news.title}
            </span>
            ${news.categoryName ? `
            <div class="hashtag">
              <span class="text-sm">#${news.categoryName}</span>
            </div>
            ` : ''}
          </a>
        </figcaption>
      </figure>
    `;

    container.appendChild(card);
  });
};


   //INFINITE SCROLL

const setupInfinityScroll = () => {
  window.addEventListener('scroll', () => {
    if (isLoading || !hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (docHeight - (scrollTop + windowHeight) < CONFIG.loadMoreOffset) {
      fetchCategoryPostList(currentPage);
    }
  });
};


   //HATA

const showError = (message) => {
  const container = document.querySelector('.news-infinite .grid');
  if (container) {
    container.innerHTML = `<p class="text-red-500 text-center">${message}</p>`;
  }
};


   //BAŞLAT






document.addEventListener('DOMContentLoaded', () => {
  
setupInfinityScroll();
fetchCategoryPostList(currentPage);
  updateSlider();
  startAutoPlay();
});



