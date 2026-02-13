import '../styles/pages/detail.scss';

let sideCurrentIndex = 0;
let sideTimer;

const updateSideSlider = () => {
  const slidesContainer = document.querySelector('.side-slides-container');
  const dots = document.querySelectorAll('.side-dot');
  const titleElement = document.getElementById('side-current-title');

  if (!slidesContainer) return;

  slidesContainer.style.transform = `translateX(-${sideCurrentIndex * 100}%)`;
  updateSlideDots(dots);
  updateSlideTitle(titleElement);
};

const updateSlideDots = (dots) => {
  if (!dots || dots.length === 0) return;
  
  dots.forEach((dot, i) => {
    if (i === sideCurrentIndex) {
      dot.classList.remove('bg-[#8B8B9F]', 'w-2', 'h-2');
      dot.classList.add('bg-brand-red', 'w-2', 'h-2');
    } else {
      dot.classList.remove('bg-brand-red', 'w-2', 'h-2');
      dot.classList.add('bg-[#8B8B9F]', 'w-2', 'h-2');
    }
  });
};

const updateSlideTitle = (titleElement) => {
  if (!titleElement) return;
  
  const slides = document.querySelectorAll('.side-slide-item img');
  if (!slides || slides.length === 0) return;
  
  if (slides[sideCurrentIndex]) titleElement.textContent = slides[sideCurrentIndex].alt;
};

const moveSideSlide = (n) => {
  const slides = document.querySelectorAll('.side-slide-item');
  if (!slides || slides.length === 0) return;
  
  sideCurrentIndex = (sideCurrentIndex + n + slides.length) % slides.length;
  updateSideSlider();
  startSideAutoPlay();
};

const goToSideSlide = (index) => {
  if (typeof index !== 'number') return;
  
  sideCurrentIndex = index;
  updateSideSlider();
  startSideAutoPlay();
};

const startSideAutoPlay = () => {
  clearInterval(sideTimer);
  sideTimer = setInterval(() => {
    moveSideSlide(1);
  }, 5000);
};

window.moveSideSlide = moveSideSlide;
window.goToSideSlide = goToSideSlide;

const initSharePanel = () => {
  const sharePanel = document.getElementById('article-share-panel');
  const closeBtn = document.getElementById('panel-close-btn');

  if (!sharePanel) return;

  if (closeBtn) closeBtn.addEventListener('click', (e) => handlePanelClose(e, sharePanel));
  
  document.addEventListener('click', (e) => handleDocumentClick(e, sharePanel));
};

const handlePanelClose = (e, sharePanel) => {
  if (!e || !sharePanel) return;
  
  e.preventDefault();
  e.stopPropagation();
  sharePanel.classList.add('hidden');
};

const handleDocumentClick = (e, sharePanel) => {
  if (!e || !sharePanel) return;
  
  const shareButton = e.target.closest('#share-btn, #share-menu-btn');
  
  if (shareButton) {
    e.preventDefault();
    e.stopPropagation();
    sharePanel.classList.toggle('hidden');
    return;
  }

  const closeBtnClick = e.target.closest('#panel-close-btn');
  if (closeBtnClick) {
    handlePanelClose(e, sharePanel);
    return;
  }

  if (!sharePanel.contains(e.target) && !sharePanel.classList.contains('hidden')) {
    sharePanel.classList.add('hidden');
  }
};

let currentFontSize = 1;

const initFontControls = () => {
  const increaseBtn = document.querySelector('.increase-btn');
  const decreaseBtn = document.querySelector('.decrease-btn');
  
  if (increaseBtn) increaseBtn.addEventListener('click', () => adjustFontSize(1));
  
  if (decreaseBtn) decreaseBtn.addEventListener('click', () => adjustFontSize(-1));
  
};

const adjustFontSize = (delta) => {
  if (typeof delta !== 'number') return;
  
  currentFontSize = Math.max(0.8, Math.min(1.4, currentFontSize + (delta * 0.1)));
  
  const articles = document.querySelectorAll('.article-content');
  if (!articles || articles.length === 0) return;
  
  articles.forEach(article => {
    article.style.fontSize = `${currentFontSize}rem`;
  });
};

const CONFIG = {
  loadMoreOffset: 1700,
  maxPage: 10
};

let currentPage = 1;
let isLoading = false;
let hasMore = true;

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const day = date.getDate();
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const dateTime=`${day} ${month} ${year} ${hours}:${minutes}`
  return dateTime;
};

const decodeHTML = (html) => {
  if (!html) return '';
  
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const fetchArticleData = async (page) => {
  if (typeof page !== 'number') {
    throw new Error('Geçersiz sayfa numarası');
  }
  try {
    const response = await fetch(`/js/api/post-detail.json?page=${page}`);
    
    if (!response.ok) {
      throw new Error(`Sayfa ${page} yüklenemedi`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return data[0].data;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

const createBreadcrumb = (articleData) => {
  if (!articleData) return null;
  
  const breadcrumb = document.createElement('div');
  breadcrumb.classList.add('breadcrumb', 'flex', 'items-center');
  
  const nav = document.createElement('nav');
  nav.classList.add('flex', 'items-center', 'gap-1', 'text-xxs', 'p-0', 'm-0', 'sm:text-xs' );
  
  if (articleData.breadcrumbs?.breadCrumbsItem) addBreadcrumbItems(nav, articleData); 
  
  breadcrumb.appendChild(nav);
  return breadcrumb;
};

const addBreadcrumbItems = (nav, articleData) => {
  if (!nav || !articleData?.breadcrumbs?.breadCrumbsItem) return;
  
  articleData.breadcrumbs.breadCrumbsItem.forEach((item) => {
    if (!item) return;
    
    const link = document.createElement('a');
    link.classList.add('color-dark', 'transition-all', 'no-underline', 'text-black', 'hover:underline' ,'line-clamp-1');
    link.href = item.url || '#';
    link.textContent = item.name || '';
    nav.appendChild(link);
    
    const arrowSpan = createBreadcrumbArrow();
    if (arrowSpan) nav.appendChild(arrowSpan);
    
  });
  
  const titleText = document.createElement('span');
  titleText.classList.add('font-bold','line-clamp-1');
  titleText.textContent = decodeHTML(articleData.title);
  nav.appendChild(titleText);
};

const createBreadcrumbArrow = () => {
  const arrowSpan = document.createElement('span');
  arrowSpan.innerHTML = '<svg width="6" height="10" viewBox="0 0 6 10" class="mx-2 w-auto h-[12px] fill-current text-gray-400 block"><path d="M.204 10.306a.697.697 0 0 0 .49.194.722.722 0 0 0 .49-.194l4.654-4.434A.524.524 0 0 0 6 5.5a.504.504 0 0 0-.162-.372L1.184.694a.716.716 0 0 0-.98 0 .637.637 0 0 0 0 .933l4.062 3.87L.2 9.373a.642.642 0 0 0 .005.933Z"/></svg>';
  return arrowSpan.firstElementChild;
};

const createArticleTitle = (articleData) => {
  if (!articleData || !articleData.title) return null;
  
  const titleArticle = document.createElement('div');
  titleArticle.classList.add('article-title', 'm-0');
  
  const h1 = document.createElement('h1');
  h1.classList.add('font-bold', 'm-0', 'text-4xl', 'lg:text-9xl', 'leading-[100%]');
  h1.textContent = decodeHTML(articleData.title);
  
  titleArticle.appendChild(h1);
  return titleArticle;
};

const createArticleInfo = (articleData) => {
  if (!articleData) return null;
  
  const infoArticle = document.createElement('div');
  infoArticle.classList.add('article-info', 'flex', 'flex-row', 'gap-1', 'justify-between', 'items-center');
  
  const leftArticle = createDateAndSourceInfo(articleData);
  const shareArticle = createShareButtons();
  
  if (leftArticle) infoArticle.appendChild(leftArticle);
  if (shareArticle) infoArticle.appendChild(shareArticle);
  
  return infoArticle;
};

const createDateAndSourceInfo = (articleData) => {
  if (!articleData) return null;
  
  const leftArticle = document.createElement('div');
  leftArticle.classList.add('flex', 'flex-col', 'justify-between', 'items-start', 'flex-wrap');
  
  const datesArticle = createDatesSection(articleData);
  const sourceArticle = createSourceSection(articleData);
  
  if (datesArticle) leftArticle.appendChild(datesArticle);
  if (sourceArticle) leftArticle.appendChild(sourceArticle);
  
  return leftArticle;
};

const createDatesSection = (articleData) => {
  if (!articleData?.articleMetaDates) return null;
  
  const datesArticle = document.createElement('div');
  datesArticle.classList.add('flex', 'gap-4', 'leading-tight', 'flex-wrap', 'text-xs');
  
  const publishArticle = createDateItem('Giriş Tarihi:', articleData.articleMetaDates.publishDateTime);
  const updateArticle = createDateItem('Son Güncelleme:', articleData.articleMetaDates.updateDateTime);
  
  if (publishArticle) datesArticle.appendChild(publishArticle);
  if (updateArticle) datesArticle.appendChild(updateArticle);
  
  return datesArticle;
};

const createDateItem = (label, dateTime) => {
  if (!label || !dateTime) return null;
  
  const dateTimeArticle = document.createElement('div');
  dateTimeArticle.classList.add('flex', 'gap-1');
  
  const labelText = document.createElement('span');
  labelText.textContent = label;
  dateTimeArticle.appendChild(labelText);
  
  const timeElement = document.createElement('time');
  timeElement.textContent = formatDate(dateTime);
  dateTimeArticle.appendChild(timeElement);
  
  return dateTimeArticle;
};

const createSourceSection = (articleData) => {
  if (!articleData?.articleMetaTags) return null;
  
  const sourceArticle = document.createElement('div');
  sourceArticle.classList.add('mt-1');
  
  const sourcetext = document.createElement('span');
  sourcetext.classList.add('font-bold', 'text-xs');
  const sources = articleData.articleMetaTags.sources || [];
  sourcetext.textContent = sources.map(s => s.label).join(' | ');
  
  sourceArticle.appendChild(sourcetext);
  return sourceArticle;
};

const createShareButtons = () => {
  const shareArticle = document.createElement('div');
  shareArticle.classList.add('share-buttons', 'flex', 'flex-row', 'gap-2', 'm-0', 'flex-shrink-0');
  
  const googleBtn = createGoogleNewsButton();
  const xBtn = createXButton();
  const whatsappBtn = createWhatsAppButton();
  const menuBtn = createMenuButton();
  
  if (googleBtn) shareArticle.appendChild(googleBtn);
  if (xBtn) shareArticle.appendChild(xBtn);
  if (whatsappBtn) shareArticle.appendChild(whatsappBtn);
  if (menuBtn) shareArticle.appendChild(menuBtn);
  
  return shareArticle;
};

const createGoogleNewsButton = () => {
  const googleLink = document.createElement('a');
  googleLink.classList.add('google-share-btn', 'border', 'border-solid', 'flex', 'items-center', 'justify-center', 'rounded-full', 'border-[#bab6b6]', 'hidden', 'px-4', 'lg:flex', 'hover:bg-black', 'transition-all');
  googleLink.href = '#';
  
  const svgSpan = document.createElement('span');
  svgSpan.innerHTML = '<svg width="86" height="16" viewBox="0 0 86 16" fill="none"><g clip-path="url(#a)"><path fill="#4885ED" d="M5.932 5.876v1.588h3.809c-.115.9-.421 1.55-.862 2.01-.555.554-1.435 1.167-2.947 1.167-2.353 0-4.19-1.895-4.19-4.248 0-2.354 1.837-4.249 4.19-4.249 1.263 0 2.201.498 2.87 1.148l1.13-1.129c-.957-.918-2.22-1.626-4-1.626C2.717.537 0 3.158 0 6.373c0 3.215 2.698 5.837 5.932 5.837 1.742 0 3.043-.574 4.076-1.627 1.053-1.052 1.378-2.545 1.378-3.731 0-.364-.019-.708-.076-.995-.02.019-5.378.019-5.378.019Z"/><path fill="#EF2B30" d="M16.151 4.574c-2.085 0-3.789 1.589-3.789 3.77 0 2.182 1.704 3.77 3.79 3.77 2.085 0 3.788-1.588 3.788-3.77 0-2.181-1.703-3.77-3.789-3.77Zm0 6.048c-1.148 0-2.124-.938-2.124-2.278s.995-2.277 2.124-2.277c1.13 0 2.125.938 2.125 2.277 0 1.34-.976 2.278-2.125 2.278Z"/><path fill="#4885ED" d="M34.713 5.416h-.057c-.364-.44-1.09-.842-1.99-.842-1.876 0-3.521 1.646-3.521 3.77 0 2.125 1.645 3.77 3.52 3.77.9 0 1.608-.402 1.99-.86h.058v.516c0 1.435-.765 2.22-2.01 2.22-1.013 0-1.645-.728-1.894-1.34l-1.435.593c.421.995 1.512 2.22 3.35 2.22 1.932 0 3.578-1.148 3.578-3.923V4.766h-1.57v.65h-.019ZM32.8 10.622c-1.149 0-2.01-.976-2.01-2.278 0-1.3.861-2.277 2.01-2.277 1.148 0 2.009.976 2.009 2.297.02 1.3-.88 2.258-2.01 2.258Z"/><path fill="#FFCA0C" d="M24.59 4.574c-2.085 0-3.788 1.589-3.788 3.77 0 2.182 1.703 3.77 3.789 3.77 2.086 0 3.789-1.588 3.789-3.77 0-2.181-1.703-3.77-3.79-3.77Zm0 6.048c-1.147 0-2.123-.938-2.123-2.278s.995-2.277 2.124-2.277 2.124.938 2.124 2.277c0 1.34-.976 2.278-2.124 2.278Z"/><path fill="#39CD55" d="M37.584.709h1.627v11.405h-1.627V.71Z"/><path fill="#EF2B30" d="M44.244 10.622c-.842 0-1.435-.383-1.837-1.149l5.052-2.085-.172-.421c-.306-.842-1.282-2.412-3.234-2.412s-3.56 1.531-3.56 3.77c0 2.24 1.588 3.77 3.732 3.77 1.722 0 2.717-1.052 3.138-1.665l-1.282-.86c-.42.65-.995 1.052-1.837 1.052ZM44.11 5.99c.67 0 1.244.344 1.435.822L42.14 8.23c0-1.589 1.129-2.24 1.971-2.24Z"/><path fill="#767676" class="group-hover:fill-white" d="M52.147 12.19V1.858h1.607l5.033 8.037h.057l-.057-1.99V1.857h1.32v10.334H58.73l-5.263-8.44h-.057l.057 1.99v6.43h-1.32v.02Zm13.032.25c-1.072 0-1.933-.364-2.603-1.072-.67-.708-.995-1.608-.995-2.698 0-1.034.325-1.914.976-2.66.65-.747 1.473-1.11 2.488-1.11 1.014 0 1.894.344 2.526 1.033.631.69.937 1.608.937 2.737l-.019.248h-5.588c.038.709.268 1.283.708 1.684.44.421.957.613 1.531.613.957 0 1.589-.402 1.933-1.206l1.187.498c-.23.555-.613 1.014-1.149 1.378-.516.363-1.167.555-1.933.555Zm1.913-4.631c-.038-.402-.21-.785-.555-1.149-.344-.363-.842-.555-1.53-.555-.498 0-.92.153-1.283.46-.363.306-.612.727-.746 1.244h4.114Zm10.353 4.382h-1.359l-1.76-5.435-1.742 5.435h-1.34l-2.276-7.08h1.377l1.57 5.338h.019l1.741-5.339h1.378l1.742 5.34h.019l1.55-5.34h1.358l-2.277 7.08Zm5.78.249c-.785 0-1.436-.192-1.953-.574a3.326 3.326 0 0 1-1.129-1.436l1.187-.497c.383.88 1.014 1.32 1.913 1.32.422 0 .747-.095 1.015-.268.268-.191.402-.42.402-.727 0-.46-.326-.765-.976-.938l-1.436-.344a3.263 3.263 0 0 1-1.282-.65 1.606 1.606 0 0 1-.612-1.302c0-.632.268-1.13.823-1.531.555-.383 1.205-.593 1.97-.593.632 0 1.187.134 1.685.42a2.36 2.36 0 0 1 1.052 1.226l-1.148.478c-.268-.632-.804-.938-1.627-.938-.401 0-.727.077-.995.249-.267.172-.401.383-.401.67 0 .402.306.67.937.823l1.397.325c.67.153 1.148.421 1.474.785.325.382.478.803.478 1.263 0 .631-.268 1.167-.784 1.588-.498.44-1.168.65-1.99.65Z"/></g><defs><clipPath id="a"><path class="fill-current" d="M0 .537h86v14.927H0z"/></clipPath></defs></svg>';
  googleLink.appendChild(svgSpan.firstElementChild);
  
  return googleLink;
};

const createXButton = () => {
  const xLink = document.createElement('a');
  xLink.classList.add('x-share-btn', 'border', 'border-solid', 'flex', 'items-center', 'justify-center', 'rounded-full', 'w-8', 'h-8', 'lg:w-10', 'lg:h-10', 'border-[#bab6b6]', 'hover:bg-black', 'transition-all');
  xLink.href = '#';
  
  const svgSpan = document.createElement('span');
  svgSpan.innerHTML = '<svg width="14" height="15" viewBox="0 0 14 15" fill="none"><path fill="#767676" d="M8.303 6.428 13.403.5h-1.209L7.766 5.647 4.23.5H.15L5.5 8.284.15 14.5H1.36l4.676-5.436L9.77 14.5h4.08L8.302 6.428ZM6.648 8.352l-.542-.775L1.794 1.41h1.857L7.13 6.387l.542.775 4.523 6.47h-1.856l-3.691-5.28Z"/></svg>';
  xLink.appendChild(svgSpan.firstElementChild);
  
  return xLink;
};

const createWhatsAppButton = () => {
  const whatsappLink = document.createElement('a');
  whatsappLink.classList.add('whatsapp-share-btn', 'group', 'border', 'border-solid', 'flex', 'items-center', 'justify-center', 'rounded-full', 'w-8', 'h-8', 'lg:w-10', 'lg:h-10', 'border-[#bab6b6]', 'hover:bg-[#2ac108]', 'transition-all');
  whatsappLink.href = '#';
  
  const svgSpan = document.createElement('span');
  svgSpan.innerHTML = '<svg width="16" height="17" viewBox="0 0 16 17" fill="none"><path class="fill-[#2ac108] group-hover:fill-white" d="M13.668 2.787A7.89 7.89 0 0 0 8.032.442C3.642.442.064 4.028.064 8.428c0 1.41.37 2.78 1.062 3.988L0 16.558l4.221-1.112a7.956 7.956 0 0 0 3.811.975c4.39 0 7.968-3.586 7.968-7.985a7.944 7.944 0 0 0-2.332-5.65Zm-5.636 12.28a6.632 6.632 0 0 1-3.377-.926l-.24-.145-2.51.66.668-2.45-.16-.249a6.67 6.67 0 0 1-1.014-3.53c0-3.658 2.975-6.64 6.625-6.64 1.769 0 3.433.694 4.68 1.95a6.594 6.594 0 0 1 1.937 4.699c.016 3.658-2.959 6.631-6.609 6.631Zm3.634-4.963c-.2-.097-1.182-.58-1.359-.653-.184-.065-.313-.097-.45.097-.136.201-.514.652-.627.781-.112.137-.233.153-.434.049-.201-.097-.844-.315-1.6-.992-.595-.531-.989-1.184-1.11-1.386-.112-.201-.016-.306.089-.41.088-.09.2-.234.297-.347.097-.113.137-.201.201-.33.065-.137.033-.25-.016-.347-.048-.097-.45-1.08-.61-1.483-.162-.386-.33-.338-.451-.346H5.21a.722.722 0 0 0-.53.25c-.177.201-.692.685-.692 1.668 0 .983.716 1.934.812 2.063.096.137 1.407 2.151 3.401 3.013.474.21.844.33 1.134.42.474.152.908.128 1.254.08.386-.056 1.182-.483 1.343-.95.168-.468.168-.863.112-.952-.056-.088-.177-.129-.378-.225Z"/></svg>';
  whatsappLink.appendChild(svgSpan.firstElementChild);
  
  return whatsappLink;
};

const createMenuButton = () => {
  const menuButton = document.createElement('button');
  menuButton.id = 'share-menu-btn';
  menuButton.classList.add('share-menu-btn', 'border', 'border-solid', 'flex', 'items-center', 'justify-center', 'rounded-full', 'w-8', 'h-8', 'lg:w-10', 'lg:h-10', 'border-[#bab6b6]', 'hover:bg-[#2d445b]', 'transition-all', 'cursor-pointer', 'bg-transparent');
  
  const svgSpan = document.createElement('span');
  svgSpan.innerHTML = '<svg width="16" height="4" viewBox="0 0 16 4" fill="none" style="pointer-events: none;"><circle cx="2" cy="2" r="1.5" fill="#767676"/><circle cx="8" cy="2" r="1.5" fill="#767676"/><circle cx="14" cy="2" r="1.5" fill="#767676"/></svg>';
  menuButton.appendChild(svgSpan.firstElementChild);

  return menuButton;
};

const createMainImage = (articleData) => {
  if (!articleData?.mainImageBig) return null;
  
  const figureMain = document.createElement('figure');
  figureMain.classList.add('flex', 'overflow-hidden', 'm-0', 'p-0', 'lg:rounded-xl');
  
  const imgMain = document.createElement('img');
  imgMain.classList.add('w-full', 'h-auto', 'object-cover', 'object-center', 'block');
  imgMain.src = articleData.mainImageBig.path || '';
  imgMain.alt = articleData.mainImageBig.alt || articleData.title || '';
  
  figureMain.appendChild(imgMain);
  return figureMain;
};

const createSpot = (articleData) => {
  if (!articleData?.spot) return null;
  
  const titleSpot = document.createElement('h2');
  titleSpot.classList.add('font-bold', 'leading-normal', 'text-base', 'lg:text-2xl');
  titleSpot.textContent = decodeHTML(articleData.spot);
  
  return titleSpot;
};

const createArticleContent = (articleData) => {
  if (!articleData) return null;
  
  const contentArticle = document.createElement('div');
  contentArticle.classList.add('article-content', 'flex', 'flex-col', 'gap-6', 'w-full', 'pb-10');
  
  const descriptionHtml = articleData.description || '';
  if (!descriptionHtml) return contentArticle;
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${descriptionHtml}</div>`, 'text/html');
  
  processDirectLinks(doc);
  styleParagraphs(doc);
   styleIframeElements (doc);
  styleStrongElements(doc);
  stylesImageElements(doc);
  stylesSpanElements(doc);
  
  const processedContent = doc.body.firstChild;
  if (!processedContent) return contentArticle;
  
  while (processedContent.firstChild) {
    contentArticle.appendChild(processedContent.firstChild);
  }
  
  return contentArticle;
};

const processDirectLinks = (doc) => {
  if (!doc) return;
  
  const directLinks = doc.querySelectorAll('.directLink');
  if (!directLinks || directLinks.length === 0) return;
  
  directLinks.forEach(linkWrapper => {
    if (!linkWrapper) return; 
    
    const anchor = linkWrapper.querySelector('a');
    const titleText = linkWrapper.querySelector('#contentTitle')?.textContent || '';
    const href = anchor ? anchor.getAttribute('href') : '#';
    
    const newLinkContainer= createDirectLinkElement(titleText, href);
    if (newLinkContainer && linkWrapper.parentNode) {
      linkWrapper.parentNode.replaceChild(newLinkContainer, linkWrapper);
    }
  });
};

const createDirectLinkElement = (titleText, href) => {
  if (!titleText) return null;
  
  const newLinkAction = document.createElement('div');
  newLinkAction.className = "article-link flex flex-col border-0 border-b border-solid py-4 border-[#e3d9d9]";
  
  const newLink = document.createElement('a');
  newLink.classList.add('flex', 'items-center', 'gap-2', 'no-underline');
  newLink.href = href || '#';
  
  const playIconSpan = document.createElement('span');
  playIconSpan.innerHTML = '<svg viewBox="0 0 640 640" width="50" height="50"><path fill="#a80000" d="M64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM252.3 211.1C244.7 215.3 240 223.4 240 232L240 408C240 416.7 244.7 424.7 252.3 428.9C259.9 433.1 269.1 433 276.6 428.4L420.6 340.4C427.7 336 432.1 328.3 432.1 319.9C432.1 311.5 427.7 303.8 420.6 299.4L276.6 211.4C269.2 206.9 259.9 206.7 252.3 210.9z"/></svg>';
  newLink.appendChild(playIconSpan.firstElementChild);
  
  const strong = document.createElement('strong');
  strong.classList.add('text-2xl', 'brand-red', 'leading-tight');
  strong.textContent = titleText;
  newLink.appendChild(strong);
  
  newLinkAction.appendChild(newLink);
  return newLinkAction;
};


const styleParagraphs = (doc) => {
  if (!doc) return;
  
  const allParagraphs = doc.querySelectorAll('p');
  if (!allParagraphs || allParagraphs.length === 0) return;
  
  allParagraphs.forEach(p => {
    if (p) {
      const hasImage = p.querySelector('img');
      if (hasImage) return;
      
      p.className = "text-base m-0 leading-[1.625] lg:text-xl";
    }
  });
};

const stylesImageElements = (doc) => {
  if (!doc) return;
  const paragraphsWithImages = doc.querySelectorAll('p');
  if (!paragraphsWithImages || paragraphsWithImages.length === 0) return;
  
  paragraphsWithImages.forEach(p => {
    const imgParagraph = p.querySelector('img');
    if (!imgParagraph) return;
    
    imgParagraph.removeAttribute('width');
    imgParagraph.removeAttribute('height');
    imgParagraph.removeAttribute('style');

    imgParagraph.className='w-full h-auto block object-cover mb-2';
    p.className = 'bg-vanilla text-sm rounded-lg leading-[1.625] lg:text-base w-full max-w-full block m-0 pb-2';
  });
};
const stylesSpanElements = (doc) => {
  if (!doc) return;
  const paragraphsWithSpans = doc.querySelectorAll('p');
  if (!paragraphsWithSpans || paragraphsWithSpans.length === 0) return;
  
  paragraphsWithSpans.forEach(p => {
    const spanParagraph = p.querySelector('span');
    if (!spanParagraph) return;

    // IMG'yi block ve full width yap
    spanParagraph.className=' text-sm rounded-lg  leading-[1.625] lg:text-base   p-2';
    
  });
};


const styleIframeElements = (doc) => {
  if (!doc) return;
  
  const iframeWrappers = doc.querySelectorAll('.iframeWrapper');
  if (!iframeWrappers || iframeWrappers.length === 0) return;
  
  iframeWrappers.forEach(wrapper => {
    const iframe = wrapper.querySelector('iframe');
    if (!iframe) return;

    iframe.classList.add('w-full', 'h-full','aspect-video');
  });
};
const styleStrongElements = (doc) => {
  if (!doc) return;
  
  const strongElements = doc.querySelectorAll('p > strong');
  if (!strongElements || strongElements.length === 0) return;
  
  strongElements.forEach(strong => {
    if (!strong) return;
    
    const text = strong.textContent.trim();
    if (!text) return;
    
    const isUpperCase = /^[A-ZÇĞİÖŞÜ\s:!?'"]+$/.test(text);
    
    if (isUpperCase && text.length > 5) {
      strong.classList.add('text-[#FF0000]', 'font-bold');
    }
  });
};


const renderArticle = (newsData) => {
  if (!newsData?.articleDetailContent) return;

  const articleData = newsData.articleDetailContent;
  const container = document.querySelector('.article-wrapper');

  if (!container) return;

  const article = createArticleElement(articleData);
  if (article) {
    container.appendChild(article);
  }
};

const createArticleElement = (articleData) => {
  if (!articleData) return null;
  
  const article = document.createElement('article');
  article.classList.add('flex', 'flex-col', 'gap-6', 'w-full', 'max-w-full', 'm-0', 'p-0', 'border-t-4', 'border-brand-red', 'pt-8', 'mt-8');
  
  const breadcrumb = createBreadcrumb(articleData);
  const title = createArticleTitle(articleData);
  const info = createArticleInfo(articleData);
  const mainImage = createMainImage(articleData);
  const spot = createSpot(articleData);
  const content = createArticleContent(articleData);
  
  if (breadcrumb) article.appendChild(breadcrumb);
  if (title) article.appendChild(title);
  if (info) article.appendChild(info);
  if (mainImage) article.appendChild(mainImage);
  if (spot) article.appendChild(spot);
  if (content) article.appendChild(content);
  
  return article;
};

const loadNextArticle = async () => {
  if (isLoading || !hasMore || currentPage > CONFIG.maxPage) {
    if (currentPage > CONFIG.maxPage) hasMore = false;
    return;
  }

  isLoading = true;

  try {
    const responseData = await fetchArticleData(currentPage);
    
    if (responseData?.articleDetailContent) {
      renderArticle(responseData);
      currentPage++;
    } else {
      hasMore = false;
    }
  } catch (error) {
  } finally {
    setTimeout(() => {
      isLoading = false; 
    }, 500); 
  }
};

const setupInfinityScroll = () => {
  window.addEventListener('scroll', () => {
    if (isLoading || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const distanceToBottom = scrollHeight - (windowHeight + scrollTop);

    if (distanceToBottom < CONFIG.loadMoreOffset) {
      loadNextArticle();
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initializeSideSlider();
  initSharePanel();
  initFontControls();
  setupInfinityScroll();

  setTimeout(() => {
    loadNextArticle();
  }, 500);
});

const initializeSideSlider = () => {
  const sideSlider = document.querySelector('.side-slides-container');
  if (!sideSlider) return;
  
  updateSideSlider();
  startSideAutoPlay();
};