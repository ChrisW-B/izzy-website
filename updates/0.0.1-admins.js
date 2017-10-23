/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 *
 * Alternatively, you can export a custom function for the update:
 * module.exports = function(done) { ... }
 */

exports.create = {
  Member: [{
    'name.first': 'Admin',
    'name.last': 'User',
    email: 'me@chrisb.xyz',
    password: 'TempPass',
    isAdmin: true
  }],
  Page: [{ name: 'About', body: '', type: 'about' },
    { name: 'Contact', body: '', type: 'contact' }
  ],
  PostCategory: [{
    name: 'Illustration'
  }, {
    name: 'Paperwork'
  }, {
    name: 'Comics'
  }, {
    name: 'Collabs'
  }]
};