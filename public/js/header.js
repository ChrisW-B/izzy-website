const headerButton = document.querySelector('#headerButton');
const headerMenu = document.querySelector('#headerMenu');

let open = false;

const showMenu = () => {
  open = true;
  headerMenu.classList.add('show-menu');
};

const hideMenu = () => {
  headerMenu.classList.toggle('hiding-menu');
  setTimeout(() => {
    open = false;
    headerMenu.classList.remove('show-menu');
    headerMenu.classList.toggle('hiding-menu');
  }, 500);
};

const toggleMenuClick = (e) => {
  if (e.target === headerButton && open) {
    hideMenu();
  } else if (e.target === headerButton && !open) {
    showMenu();
  } else if (e.target !== headerMenu) {
    hideMenu();
  }
};

document.addEventListener('click', toggleMenuClick);
// headerButton.addEventListener('mouseover', showMenu);
// headerMenu.addEventListener('mouseout', hideMenu);