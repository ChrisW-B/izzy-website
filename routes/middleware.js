const _ = require('lodash');
const fs = require('fs');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer')({ browsers: ['> 2%'], cascade: true });
const path = require('path');

/**
  Initialises the standard view locals
*/
exports.initLocals = function (req, res, next) {
  res.locals.navLinks = [
    { label: 'Home', key: 'home', href: '/' },
    { label: 'About', key: 'about', href: '/about' },
    { label: 'Collaborations', key: 'collaborations', href: '/collaborations' },
    { label: 'Illustrations', key: 'illustrations', href: '/illustrations' },
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

exports.autoPrefix = (req, res, next) => {
  if (!req.path.includes('/styles/')) next();
  else {
    res.set('Content-Type', 'text/css');
    fs.readFile(path.join(__dirname, '..', 'public', 'styles', 'sass_build', req.path), (err, css) => {
      postcss([autoprefixer])
        .process(css)
        .then(result => res.send(result.css));
    });
  }
};