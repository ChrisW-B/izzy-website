const slideshowInfo = {
  index: 0,
  photos: null,
  name: null
};

const createSlide = ({ src, permalink = '', title = '', caption = '' }) =>
  $(`
  <li class="slide-wrapper">
    <img class="photo" src="${src}"/>
    <div class="content">
      <h2>${title}</h2>
      <p>${caption}</p>
      <a href="${permalink}">Permalink</a>
    </div>
  </li>
  `);

const setContentWidth = () => {
  console.log('updating');
  const image = $('.featherlight-content .lightbox-images .slide-wrapper.focus-image .photo');
  const content = $('.featherlight-content .lightbox-images .slide-wrapper.focus-image .content');
  content.css('width', image.width());
}

const updateSlideshow = () => {
  const { index, photos, name } = slideshowInfo;
  let prev = $('<li class="dummy-slide"/>');
  let next = prev.clone();
  if (index > 0) prev = createSlide(photos[index - 1]).addClass('prev-image');
  if (index < photos.length - 1) next = createSlide(photos[index + 1]).addClass('next-image');
  $(`.${name}.lightbox-images`).html([prev, createSlide(photos[index]).addClass('focus-image'), next]);
  $(`.${name}.lightbox-images .slide-wrapper.focus-image .photo`).imagesLoaded(setContentWidth);
};

const prevImage = () => {
  const { index } = slideshowInfo;
  slideshowInfo.index = index - 1;
  updateSlideshow();
};

const nextImage = () => {
  const { index } = slideshowInfo;
  slideshowInfo.index = index + 1;
  updateSlideshow();
};

const closeSlideShow = ({ target }) => {
  if ($(target).is('img.photo')) return;
  $.featherlight.close();
};

const navigate = ({ keyCode }) => {
  const { index, photos } = slideshowInfo;
  if (keyCode === 39 && index < photos.length - 1) nextImage(); // right = 39
  if (keyCode === 37 && index > 0) prevImage(); // left = 37
};

const createSlideshow = (name, info) => {
  slideshowInfo.index = 0;
  slideshowInfo.photos = info;
  slideshowInfo.name = name;
  updateSlideshow();
};

$(window).on('resize', setContentWidth);
$(document).on('click', '.prev-image', prevImage);
$(document).on('click', '.next-image', nextImage);
$(document).on('click', '.featherlight', closeSlideShow);
$(document).on('keydown', navigate);

$.featherlight.defaults.beforeClose = () => {
  slideshowInfo.name = '';
  slideshowInfo.index = 0;
  slideshowInfo.photos = [];
};