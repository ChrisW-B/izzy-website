let slideshowInfo = {
  index: 0,
  photos: null,
  slug: null,
};

const createSlide = ({ src, permalink = '', title = '', caption = '', hover = '' }) =>
  $(`
  <li class="slide-wrapper">
    <img class="photo" src="${src}" title='${hover}'/>
    <div class="content">
      <h2>${title}</h2>
      <p>${caption}</p>
      <a href="${permalink}">Permalink</a>
    </div>
  </li>
  `);

const updateSlideshow = () => {
  const { index, photos, slug } = slideshowInfo;
  let prev = $('<li class="dummy-slide"/>');
  let next = prev.clone();
  if (index > 0) prev = createSlide(photos[index - 1]).addClass('prev-image');
  if (index < photos.length - 1) next = createSlide(photos[index + 1]).addClass('next-image');
  $(`.${slug}.lightbox-images`).html([
    prev,
    createSlide(photos[index]).addClass('focus-image'),
    next,
  ]);
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

function createSlideshow() {
  const { slug, images } = this.dataset;
  slideshowInfo = {
    index: 0,
    photos: JSON.parse(images),
    slug,
  };
  updateSlideshow();
}

$(document).on('click', '.prev-image', prevImage);
$(document).on('click', '.next-image', nextImage);
$(document).on('click', '.featherlight', closeSlideShow);
$(document).on('keydown', navigate);

$.featherlight.defaults.beforeClose = () => {
  slideshowInfo = {
    index: 0,
    photos: [],
    slug: '',
  };
};

const posts = document.querySelectorAll('.post');
posts.forEach((post) => post.addEventListener('click', createSlideshow));
