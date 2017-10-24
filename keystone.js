// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
const keystone = require('keystone');
const handlebars = require('express-handlebars');
const _ = require('lodash');
const Helpers = require('./templates/views/helpers');

keystone.init({
  name: 'izzy\'s homepage',
  brand: 'izzy\'s homepage',

  sass: 'public',
  static: 'public',
  favicon: 'public/favicon.ico',
  views: 'templates/views',
  'view engine': '.hbs',
  'custom engine': handlebars.create({
    layoutsDir: 'templates/views/layouts',
    partialsDir: 'templates/views/partials',
    defaultLayout: 'default',
    helpers: new Helpers(),
    extname: '.hbs'
  }).engine,
  'auto update': true,
  'session store': 'mongo',
  auth: true,
  'user model': 'Member'
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
  'Static Pages': ['pages'],
  members: 'members'
});

keystone.set('cloudinary config', process.env.CLOUDINARY_URL);
keystone.set('cloudinary secure', true);

keystone.start();