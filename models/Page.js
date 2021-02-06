const keystone = require('keystone');

const { Types } = keystone.Field;

/**
 * About Model
 * allows for editing of the frontend page
 * ==========
 */

const Page = new keystone.List('Page', {
  map: { name: 'title' },
  nocreate: true,
  nodelete: true,
});

Page.add({
  title: { type: String, required: true },
  body: {
    type: Types.Html,
    wysiwyg: true,
    height: 250,
  },
  type: {
    type: Types.Select,
    options: 'contact, about',
    hidden: true,
  },
});

Page.register();