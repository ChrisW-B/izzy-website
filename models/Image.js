const keystone = require('keystone');

const { Types } = keystone.Field;

/**
 * Image Model
 * ==========
 */

const Image = new keystone.List('Image', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true },
});

Image.add({
  name: { type: String, required: true },
  image: {
    type: Types.CloudinaryImage,
    autoCleanup: true,
    required: true,
    initial: true,
  },
  caption: {
    type: Types.Html,
    wysiwyg: true,
    initial: true,
    height: 250,
  },
  hover: {
    type: String,
    initial: true,
    label: 'Hover Text',
  },
});
Image.relationship({ ref: 'Post', path: 'posts', refPath: 'images' });
Image.defaultColumns = 'name, image|20%, caption, hover';

Image.register();