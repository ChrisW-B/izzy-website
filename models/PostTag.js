const keystone = require('keystone');

/**
 * PostTag Model
 * ==================
 */

const PostTag = new keystone.List('PostTag', {
  autokey: { from: 'name', path: 'key', unique: true }
});

PostTag.add({
  name: { type: String, required: true }
});

PostTag.relationship({ ref: 'Post', path: 'posts', refPath: 'tags' });

PostTag.register();