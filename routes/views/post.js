const keystone = require('keystone');

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res);
  const { post, type } = req.params;
  const { locals } = res;

  // Set locals
  locals.section = type;
  locals.filters = { post };
  locals.data = { posts: [] };

  // Load the current post
  view.on('init', (next) => {
    const q = keystone
      .list('Post')
      .model.findOne({
        state: 'published',
        slug: locals.filters.post,
      })
      .populate('author tags images');

    q.exec((err, result) => {
      locals.data.post = result;
      locals.title = result.title;
      next(err);
    });
  });

  // Load other posts
  view.on('init', (next) => {
    const q = keystone
      .list('Post')
      .model.find()
      .where('state', 'published')
      .sort('-publishedDate')
      .populate('author')
      .limit('4');

    q.exec((err, results) => {
      locals.data.posts = results;
      next(err);
    });
  });

  // Render the view
  view.render('post');
};