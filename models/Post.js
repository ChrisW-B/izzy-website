const keystone = require('keystone');

const { Types } = keystone.Field;

/**
 * Post Model
 * ==========
 */

const Post = new keystone.List('Post', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true
});

Post.add({
  title: { type: String, required: true },
  category: {
    type: Types.Select,
    options: 'collaborations, illustrations, paperwork, comics',
    required: true,
    initial: true
  },
  state: {
    type: Types.Select,
    options: 'draft, published, archived',
    default: 'draft',
    index: true
  },
  author: { type: Types.Relationship, ref: 'Member', index: true },
  publishedDate: {
    type: Types.Datetime,
    index: true,
    dependsOn: { state: 'published' },
    default: Date.now
  },
  'cover-photo': {
    type: Types.Relationship,
    ref: 'Image',
    index: true,
    dependsOn: { category: 'comics' },
    createInline: true
  },
  images: {
    type: Types.Relationship,
    ref: 'Image',
    many: true,
    createInline: true,
    required: true,
    initial: true
  },
  content: { type: Types.Html, wysiwyg: true, height: 450 },
  tags: {
    type: Types.Relationship,
    ref: 'Tag',
    many: true,
    createInline: true
  }
});

Post.schema.methods.isPublished = () =>
  this.state === 'published';

Post.schema.pre('save', function (next) {
  if (this.isModified('state') && this.isPublished() && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();