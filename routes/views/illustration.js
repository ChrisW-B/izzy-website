const keystone = require('keystone');

const Illustration = (req, res) => {
  const view = new keystone.View(req, res);
  const { locals } = res;

  // Init locals
  locals.section = 'illustration';
  locals.filters = {
    category: req.params.category
  };
  locals.data = {
    posts: [],
    categories: []
  };

  // Load the current category filter
  view.on('init', (next) => {
    keystone.list('PostCategory').model.findOne({ key: 'illustration' }).exec((err, result) => {
      locals.data.category = result;
      next(err);
    });
  });

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
      .populate('author categories');

    if (locals.data.category) {
      q.where('categories').in([locals.data.category]);
    }

    q.exec((err, results) => {
      locals.data.posts = results;
      next(err);
    });
  });

  // Render the view
  view.render('illustration');
};

exports = Illustration;
module.exports = Illustration;