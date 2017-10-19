const keystone = require('keystone');

const { Types } = keystone.Field;

/**
 * Image Model
 * ==========
 */

const Image = new keystone.List('Image', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true }
});

Image.add({
  name: { type: String, required: true },
  image: {
    type: Types.CloudinaryImage,
    autoCleanup: true,
    required: true,
    initial: false
  },
  caption: { type: Types.Textarea, height: 150 }
});

Image.register();