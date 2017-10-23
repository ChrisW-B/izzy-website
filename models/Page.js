const keystone = require('keystone');

const { Types } = keystone.Field;

/**
 * About Model
 * allows for editing of the frontend page
 * ==========
 */

const Page = new keystone.List('Page', {
  map: { name: 'name' },
  nocreate: true,
  nodelete: true
});

Page.add({
  name: { type: String, required: true },
  body: {
    type: Types.Html,
    wysiwyg: true,
    height: 250
  },
  type: {
    type: Types.Select,
    options: 'contact, about'
  }
});

Page.register();