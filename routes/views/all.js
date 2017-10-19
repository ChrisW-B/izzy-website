const keystone = require('keystone');
const async = require('async');

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res);

  // Init locals
  const { locals } = res;
  locals.section = 'all';
  locals.title = 'All Posts';
  locals.filters = { ...req.params };
  locals.data = { posts: [], tags: [] };

  // Load all tags
  view.on('init', (next) => {
    keystone.list('Tag').model.find().sort('name').exec((err, results) => {
      if (err || !results.length) {
        return next(err);
      }

      locals.data.tags = results;

      // Load the counts for each tags
      return async.each(locals.data.tags, (tag, next) => {
        keystone.list('Post').model.count().where('tags').in([tag.id]).exec((err, count) => {
          tag.postCount = count;
          next(err);
        });
      }, (err) => {
        next(err);
      });
    });
  });

  // Load the current tag filter
  view.on('init', (next) => {
    if (req.params.tag) {
      keystone.list('Tag').model.findOne({ key: locals.filters.tag }).exec((err, result) => {
        locals.data.tag = result;
        next(err);
      });
    } else {
      next();
    }
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
      .populate('author tags category images');

    if (locals.data.tag) {
      q.where('tags').in([locals.data.tag]);
    }

    q.exec((err, results) => {
      locals.data.posts = results;
      next(err);
    });
  });

  // Render the view
  view.render('grid_page');
};