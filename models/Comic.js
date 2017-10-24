const keystone = require('keystone');

const { Types } = keystone.Field;

/**
 * Comic Model
 * ==========
 */

const Comic = new keystone.List('Comic', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true
});

Comic.add({
  title: { type: String, required: true },
  state: {
    type: Types.Select,
    options: 'draft, published, archived',
    default: 'draft',
    index: true
  },
  author: { type: Types.Relationship, ref: 'Member', index: true },
  images: {
    type: Types.Relationship,
    ref: 'Image',
    many: true,
    createInline: true,
    required: true,
    initial: true
  },
  description: {
    type: Types.Html,
    wysiwyg: true,
    height: 150
  },
  tags: {
    type: Types.Relationship,
    ref: 'Tag',
    many: true,
    createInline: true
  }
});

Comic.schema.methods.isPublished = () =>
  this.state === 'published';

Comic.schema.pre('save', (next) => {
  if (this.isModified('state') && this.isPublished() && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

Comic.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Comic.register();