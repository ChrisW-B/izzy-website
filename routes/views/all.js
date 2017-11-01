const keystone = require('keystone');
const async = require('async');

const All = (req, res, info) => {
  const view = new keystone.View(req, res);

  // Init locals
  const { locals } = res;
  locals.section = 'all';
  locals.title = 'All Posts';
  locals.filters = { ...req.params };
  locals.data = { posts: [], tags: [] };

  // Load the posts
  view.on('init', (next) => {
    const q = keystone.list('Post')
      .paginate({
        page: req.query.page || 1,
        perPage: 10,
        maxPages: 10,
        filters: {
          state: 'published'
        }
      })
      .sort('-publishedDate')
      .populate('author tags images');

    q.exec((err, results) => {
      locals.data.posts = results;
      next(err);
    });
  });

  // Render the view
  view.render('grid');
};

exports = All;
module.exports = All;