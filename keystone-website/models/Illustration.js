const keystone = require('keystone');

const { Types } = keystone.Field;

/**
 * Illustration Model
 * ==========
 */

const Illustration = new keystone.List('Illustration', {
  map: { name: 'title' },

  autokey: { path: 'slug', from: 'title', unique: true }
});

Illustration.add({
  title: { type: String, required: true },
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
  categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

Illustration.schema.virtual('content.full').get(() => this.content.extended || this.content.brief);

Illustration.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Illustration.register();