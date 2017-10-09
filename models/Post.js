const keystone = require('keystone');

const { Types } = keystone.Field;

/**
 * Illustration Model
 * ==========
 */

const Post = new keystone.List('Post', {
  map: { name: 'title' },

  autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
  title: { type: String, required: true },
  category: { type: Types.Relationship, ref: 'PostCategory' },
  state: {
    type: Types.Select,
    options: 'draft, published, archived',
    default: 'draft',
    index: true
  },
  author: { type: Types.Relationship, ref: 'User', index: true },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  image: { type: Types.CloudinaryImage },
  content: {
    brief: { type: Types.Html, wysiwyg: true, height: 150 },
    extended: { type: Types.Html, wysiwyg: true, height: 400 }
  },
  tags: { type: Types.Relationship, ref: 'PostTag', many: true, createInline: true }
});

Post.schema.virtual('content.full').get(() => this.content.extended || this.content.brief);

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();