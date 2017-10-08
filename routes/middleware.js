const _ = require('lodash');

/**
  Initialises the standard view locals
*/
exports.initLocals = function (req, res, next) {
  res.locals.navLinks = [
    { label: 'Home', key: 'home', href: '/' },
    { label: 'About', key: 'about', href: '/about' },
    { label: 'Collabs', key: 'collabs', href: '/collabs' },
    { label: 'Illustration', key: 'illustration', href: '/illustration' },
    { label: 'Comics', key: 'comics', href: '/comics' },
    { label: 'Paperwork', key: 'paperwork', href: '/paperwork' },
    { label: 'Contact', key: 'contact', href: '/contact' }
  ];
  res.locals.user = req.user;
  next();
};

/**
  Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
  const flashMessages = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    error: req.flash('error')
  };
  res.locals.messages = _.some(flashMessages, msgs => msgs.length) ? flashMessages : false;
  next();
};

/**
  Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
  if (!req.user) {
    req.flash('error', 'Please sign in to access this page.');
    res.redirect('/keystone/signin');
  } else {
    next();
  }
};