const keystone = require('keystone');
const fetch = require('node-fetch');

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
    const newEmail = new Email.model();
    const updater = newEmail.getUpdateHandler(req);
    const ip = req._remoteAddress;
    const captchaRes = req.body['g-recaptcha-response'];
    const postParams = `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaRes}&remoteIp=${ip}`;
    fetch(`https://www.google.com/recaptcha/api/siteverify?${postParams}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        updater.process(
          {
            action: req.body.action,
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
            spamScore: json.score,
          },
          {
            flashErrors: true,
            fields: 'name, email, message, subject, spamScore',
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
      })
      .catch((err) => {
        if (err) {
          locals.validationErrors = err.errors;
        } else {
          locals.enquirySubmitted = true;
        }
        next();
      });
  });

  // Render the view
  view.render('contact');
};
