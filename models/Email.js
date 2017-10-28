const keystone = require('keystone');
const KeystoneEmail = require('keystone-email');

const { Types } = keystone.Field;

/**
 * Email Model
 * =============
 */

const Email = new keystone.List('Email', {
  nocreate: true,
  noedit: true
});

Email.add({
  name: { type: Types.Name, required: true },
  email: { type: Types.Email, required: true },
  subject: { type: String, required: true },
  message: { type: Types.Markdown, required: true },
  createdAt: { type: Date, default: Date.now }
});

Email.schema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

Email.schema.post('save', function () {
  if (this.wasNew) {
    this.sendNotificationEmail();
  }
});

Email.schema.methods.sendNotificationEmail = function (callback) {
  if (typeof callback !== 'function') {
    callback = function (err) {
      if (err) {
        console.error('There was an error sending the notification email:', err);
      }
    };
  }

  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    console.log('Unable to send email - no mailgun credentials provided');
    return callback(new Error('could not find mailgun credentials'));
  }

  return keystone.list('Member').model.find().where('isAdmin', true).exec((err, admins) => {
    if (err) return callback(err);

    const email = new KeystoneEmail('templates/emails/notification.hbs', {
      transport: 'mailgun'
    });

    return email.send({
      email: this,
      layout: false
    }, {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      to: admins,
      from: { name: process.env.BLOG_NAME, email: process.env.MAIL_FROM },
      subject: this.subject
    }, (err, result) => (err
      ? console.error('🤕 Mailgun test failed with error:\n', err)
      : console.log('📬 Successfully sent Mailgun test with result:\n', result)));
  });
};

Email.defaultSort = '-createdAt';
Email.defaultColumns = 'name, email, enquiryType, createdAt';
Email.register();