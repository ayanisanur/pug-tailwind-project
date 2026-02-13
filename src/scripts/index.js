import '../styles/pages/index.scss';

let currentIndex = 0;
let timer;

const updateSlider = () => {
  const slidesContainer = document.querySelector('.slides-container');
  const dots = document.querySelectorAll('.dot');

  if (!slidesContainer) return;

  slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateDots(dots);
};

const updateDots = (dots) => {
  dots.forEach((dot, i) => {
    if (i === currentIndex) {
      setActiveDot(dot, i);
    } else {
      setInactiveDot(dot);
    }
  });
};

const setActiveDot = (dot, index) => {
  dot.className = "dot bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center transition-all w-8 h-8 border-none";
  dot.innerHTML = `<span class="font-extrabold text-sm">${index + 1}</span>`;
};

const setInactiveDot = (dot) => {
  dot.className = "dot w-3 h-3 opacity-100 rounded-full transition-all bg-color-pagination border-none";
  dot.innerHTML = "";
};

const moveSlide = (n) => {
  const slides = document.querySelectorAll('.slide-item');
  currentIndex = (currentIndex + n + slides.length) % slides.length;
  updateSlider();
  startAutoPlay();
};

const goToSlide = (index) => {
  currentIndex = index;
  updateSlider();
  startAutoPlay();
};

const startAutoPlay = () => {
  clearInterval(timer);
  timer = setInterval(() => {
    moveSlide(1);
  }, 5000);
};

window.moveSlide = moveSlide;
window.goToSlide = goToSlide;

const CONFIG = {
  loadMoreOffset: 700,
  maxPage: 5
};

let currentPage = 1;
let isLoading = false;
let hasMore = true;

const fetchCategoryPostList = async (page) => {
  if (isLoading || !hasMore) return;
  
  if (currentPage > CONFIG.maxPage) {
    hasMore = false;
    return;
  }

  isLoading = true;

  try {
    const response = await fetch(`/js/api/category-post-list.json?page=${currentPage}`);

    if (!response.ok) throw new Error('Kategori verisi alınamadı');
    
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

const renderNews = (newsArray) => {
  const container = document.querySelector('.news-infinite .grid');
  if (!container) return;

  newsArray.forEach((news) => {
    const card = createNewsCard(news);
    container.appendChild(card);
  });
};

const createNewsCard = (news) => {
  const cardNews = document.createElement('div');
  cardNews.className = 'flex rounded-sm border overflow-hidden border-solid border-mist bg-white';

  const cardFigure = document.createElement('figure');
  cardFigure.className = 'flex flex-col m-0 p-0';

  const cardImage = createNewsImage(news);
  const cardCaption = createNewsCaption(news);

   cardFigure.appendChild(cardImage);
   cardFigure.appendChild(cardCaption);
  cardNews.appendChild(cardFigure);

  return cardNews;
};

const createNewsImage = (news) => {
  const imageContainer = document.createElement('div');
  imageContainer.className = 'news-img w-full overflow-hidden m-0 h-[140px] sm:h-[207px] md:h-[115px] lg:h-[160px]';

  const imageLink = document.createElement('a');
  imageLink.className = 'no-underline';
  imageLink.href = news.url || '#';

  const newsImage = document.createElement('img');
  newsImage.src = news.image.path;
  newsImage.alt = news.title;
  newsImage.loading = 'lazy';
  newsImage.className = 'news-card-image w-full h-full object-cover';
  newsImage.width = news.image.width;
  newsImage.height = news.image.height;

  imageLink.appendChild(newsImage);
  imageContainer.appendChild(imageLink);

  return imageContainer;
};

const createNewsCaption = (news) => {
  const caption = document.createElement('figcaption');
  caption.className = 'flex flex-col gap-2 m-0 p-3 md:p-4';

  const figureLink = document.createElement('a');
  figureLink.className = 'no-underline color-dark flex flex-col gap-5 hover:brand-red';
  figureLink.href = news.url || '#';

  const newsTitle = createNewsTitle(news);
  figureLink.appendChild(newsTitle);

  if (news.categoryName) {
    const hashtag = createHashtag(news.categoryName);
    figureLink.appendChild(hashtag);
  }

  caption.appendChild(figureLink);
  return caption;
};

const createNewsTitle = (news) => {
  const cardTitle = document.createElement('span');
  cardTitle.className = 'font-bold text-base line-clamp-2 leading-snug';
  cardTitle.textContent = news.title;
  return cardTitle;
};

const createHashtag = (categoryName) => {
  const cardHashtag = document.createElement('div');
  cardHashtag.className = 'hashtag';

  const hashtagSpan = document.createElement('span');
  hashtagSpan.className = 'text-sm';
  hashtagSpan.textContent = `#${categoryName}`;

  cardHashtag.appendChild(hashtagSpan);
  return cardHashtag;
};

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

const showError = (message) => {
  const infiniteContainer = document.querySelector('.news-infinite .grid');
  if (!infiniteContainer) return;

  const errorP = document.createElement('p');
  errorP.className = 'text-red-500 text-center';
  errorP.textContent = message;

  infiniteContainer.innerHTML = '';
  infiniteContainer.appendChild(errorP);
};

const initializeSlider = () => {
  updateSlider();
  startAutoPlay();
  console.log('Slider başlatıldı');
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('Sayfa yüklendi, başlatılıyor...');
  
  initializeSlider();
  setupInfinityScroll();
  fetchCategoryPostList(currentPage);
  
  console.log('Infinity scroll aktif');
});