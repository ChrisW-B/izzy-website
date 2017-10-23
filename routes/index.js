const keystone = require('keystone');
const middleware = require('./middleware');

const importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
const routes = {
  views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function (app) {
  // Views
  app.get('/', routes.views.index);

  app.get('/about', routes.views.about);
  app.get('/contact', routes.views.contact);

  app.get('/all/:tag?', routes.views.all);
  app.get('/illustration/:tag?', (req, res) => routes.views.grid_page(req, res, { section: 'illustration', title: 'Illustrations' }));
  app.get('/paperwork/:tag?', (req, res) => routes.views.grid_page(req, res, { section: 'paperwork', title: 'Paperwork' }));
  app.get('/collabs/:tag?', (req, res) => routes.views.grid_page(req, res, { section: 'collabs', title: 'Collaborations' }));
  app.get('/comics/:tag?', (req, res) => routes.views.grid_page(req, res, { section: 'comics', title: 'Comics' }));

  app.get('/:type/post/:post', routes.views.post);
};