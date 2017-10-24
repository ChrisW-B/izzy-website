const keystone = require('keystone');

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res);
  const { locals } = res;

  locals.section = 'about';

  view.on('init', (next) => {
    keystone.list('Page').model.findOne({ type: 'contact' })
      .exec((err, result) => {
        locals.data = result;
        locals.title = result.title;
        next(err);
      });
  });

  // Render the view
  view.render('about');
};