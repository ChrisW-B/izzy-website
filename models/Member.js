const keystone = require('keystone');

const { Types } = keystone.Field;

/**
 * Member Model
 * ==========
 */
const Member = new keystone.List('Member');

Member.add({
  name: { type: Types.Name, required: true, index: true },
  email: {
    type: Types.Email,
    initial: true,
    required: true,
    unique: true,
    index: true
  },
  password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
  isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
Member.schema.virtual('canAccessKeystone').get(function () {
  return this.isAdmin;
});

/**
 * Relationships
 */
Member.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

/**
 * Registration
 */
Member.defaultColumns = 'name, email, isAdmin';
Member.register();