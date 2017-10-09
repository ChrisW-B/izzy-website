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
  app.get('/illustration/:tag?', routes.views.illustration);
  app.get('/paperwork/:tag?', routes.views.paperwork);
  app.get('/collabs/:tag?', routes.views.collabs);
  app.get('/comics/:tag?', routes.views.comics);

  app.get('/:type/post/:post', routes.views.post);
};