const $grid = $('.blog').masonry({
  itemSelector: '.post',
  columnWidth: '.post',
  fitWidth: true
});
$(window).resize(() => $grid.masonry('layout'));
$grid.imagesLoaded().progress(() => $grid.masonry('layout'));

let slideShowIndex = 0;
let photos = null;
let name = null;

const updateSlideshow = () => {
  let prev = $('<li />');
  let next = $('<li />');
  const slideshow = $(`.${name}.lightbox-images`);
  if (slideShowIndex > 0) {
    prev = $(photos[slideShowIndex - 1]).clone();
    prev.addClass('prev-image');
  }
  if (slideShowIndex < photos.length - 1) {
    next = $(photos[slideShowIndex + 1]).clone();
    next.addClass('next-image');
  }
  const newHTML = [prev, $(photos[slideShowIndex]).clone(), next];
  slideshow.html(newHTML);
  console.log(photos);
};

const createSlideshow = (slideshowName) => {
  slideShowIndex = 0;
  name = slideshowName;
  photos = $(`.${name}.lightbox-images .photo-wrapper`);
  updateSlideshow();
};

$(document).on('click', '.prev-image', (e) => {
  e.stopPropagation();
  slideShowIndex -= 1;
  updateSlideshow();
});
$(document).on('click', '.next-image', (e) => {
  e.stopPropagation();
  e.preventDefault();
  slideShowIndex += 1;
  updateSlideshow();
});