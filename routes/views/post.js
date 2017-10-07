const keystone = require('keystone');

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res);
  const section = req.url.split('/')[1];
  const { locals } = res;
  const query = section.replace(/\b\w/g, l => l.toUpperCase());
  // Set locals
  locals.section = section;
  locals.filters = {
    post: req.params.post
  };
  locals.data = {
    posts: []
  };

  // Load the current post
  view.on('init', (next) => {
    const q = keystone.list(query).model.findOne({
      state: 'published',
      slug: locals.filters.post
    }).populate('author categories');

    q.exec((err, result) => {
      locals.data.post = result;
      next(err);
    });
  });

  // Load other posts
  view.on('init', (next) => {
    const q = keystone.list(query).model.find().where('state', 'published').sort('-publishedDate').populate('author')
      .limit('4');

    q.exec((err, results) => {
      locals.data.posts = results;
      next(err);
    });
  });

  // Render the view
  view.render('post');
};