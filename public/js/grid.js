const $grid = $('.blog').masonry({
  itemSelector: '.post',
  columnWidth: '.post',
  fitWidth: true
});
$(window).resize(() => $grid.masonry('layout'));
$grid.imagesLoaded().progress(() => $grid.masonry('layout'));