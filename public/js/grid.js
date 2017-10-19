const $grid = $('.blog').masonry({
  itemSelector: '.post',
  columnWidth: '.post',
  fitWidth: true
});
$(window).resize(() => $grid.masonry('layout'));
$grid.imagesLoaded().progress(() => $grid.masonry('layout'));

const slideshowInfo = {
  index: 0,
  photos: null,
  name: null
};

const createSlide = (src, permalink='', title='', caption='') => {
  return $(`
  <li class="photo-wrapper">
    <img class="photo" src="${src}"></img>
    <div class="content">
      <h2><a href="${permalink}">${title}</a></h2>
      <p>${caption}</p>
      <a href="${permalink}">Permalink</a>
    </div>
  </li>
  `);
};

const updateSlideshow = () => {
  const { index, photos, name } = slideshowInfo;
  const {src, permalink, title, caption} = photos[index];
  const slideshow = $(`.${name}.lightbox-images`);
  let prev = $('<li />').addClass('dummy-slide');
  let next = prev.clone();
  if (index > 0) {
    prev = createSlide(photos[index - 1].src).addClass('prev-image');
  }
  if (index < photos.length - 1) {
    next = createSlide(photos[index + 1].src).addClass('next-image');
  }
  slideshow.html([prev, createSlide(src, permalink, title, caption), next]);
};

const createSlideshow = (name, info) => {
  slideshowInfo.index = 0;
  slideshowInfo.photos = info;
  slideshowInfo.name = name;
  updateSlideshow();
};

const prevImage = () => {
  const { index } = slideshowInfo;
  if (!(index > 0)) return;
  slideshowInfo.index = index - 1;
  updateSlideshow();
};

const nextImage = () => {
  const { index, photos } = slideshowInfo;
  if (!(index < photos.length - 1)) return;
  slideshowInfo.index = index + 1;
  updateSlideshow();
};

const closeSlideShow = ({ target }) => {
  if ($(target).is('img.photo')) return;
  $.featherlight.close();
};

const navigate = ({ keyCode }) => {
  // right = 39
  if (keyCode === 39) nextImage();
  // left = 37
  if (keyCode === 37) prevImage();
};

$(document).on('click', '.prev-image', prevImage);
$(document).on('click', '.next-image', nextImage);
$(document).on('click', '.featherlight', closeSlideShow);
$(document).on('keydown', navigate);

$.featherlight.defaults.beforeClose = () => {
  slideshowInfo.name = '';
  slideshowInfo.index = 0;
  slideshowInfo.photos = [];
};