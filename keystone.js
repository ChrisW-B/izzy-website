// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
const keystone = require('keystone');
const handlebars = require('express-handlebars');
const _ = require('lodash');
const Helpers = require('./templates/views/helpers');
const path = require('path');

keystone.init({
  name: process.env.BLOG_NAME,
  brand: process.env.BLOG_NAME,
  static: 'public',
  favicon: 'public/favicon.ico',
  views: 'templates/views',
  emails: 'templates/emails',
  sass: 'public',
  auth: true,
  'view engine': '.hbs',
  'custom engine': handlebars.create({
    layoutsDir: './templates/views/layouts',
    partialsDir: './templates/views/partials',
    defaultLayout: 'default',
    helpers: new Helpers(),
    extname: '.hbs'
  }).engine,
  'auto update': true,
  'session store': 'mongo',
  'user model': 'Member'
});

keystone.set('sass options', {
  dest: path.join(__dirname, 'public', 'styles', 'sass_build'),
  response: false
});

keystone.import('models');
keystone.set('locals', {
  _,
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable
});
keystone.set('routes', require('./routes'));

keystone.set('nav', {
  posts: ['posts', 'images', 'tags'],
  'Static Pages': 'pages',
  members: 'members',
  emails: 'emails'
});

keystone.set('cloudinary config', process.env.CLOUDINARY_URL);
keystone.set('cloudinary secure', true);

keystone.start();