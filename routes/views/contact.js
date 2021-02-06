const keystone = require('keystone');

const Email = keystone.list('Email');

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res);
  const { locals } = res;

  locals.section = 'contact';

  view.on('init', (next) => {
    keystone
      .list('Page')
      .model.findOne({ type: 'contact' })
      .exec((err, result) => {
        locals.data = result;
        locals.title = result.title;
        next(err);
      });
  });

  // On POST requests, add the Enquiry item to the database
  view.on('post', { action: 'contact' }, (next) => {
    console.log({ body: req.body });
    const newEmail = new Email.model();
    const updater = newEmail.getUpdateHandler(req);

    updater.process(
      req.body,
      {
        flashErrors: true,
        fields: 'name, email, message, subject',
        errorMessage: 'There was a problem submitting your enquiry:',
      },
      (err) => {
        if (err) {
          locals.validationErrors = err.errors;
        } else {
          locals.enquirySubmitted = true;
        }
        next();
      },
    );
  });

  // Render the view
  view.render('contact');
};