var keystone = require('keystone');
const mailgun = require('mailgun-js');
const cbOptions = require('../../../options.js');

const DOMAIN = cbOptions.mailgun.domain;
const apiKey = cbOptions.mailgun.apiKey;
const mg = mailgun({ apiKey, domain: DOMAIN });

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.section = 'account';

  // Turn off ads on this page
  locals.hideAds = true;

  view.on('init', function(next) {

    var userConfirm = req.user.confirmHash;

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: '"CloseBrace" <contact@closebrace.com>', // sender address
      to: req.user.email, // list of receivers
      subject: 'Please Confirm Your CloseBrace Account', // Subject line
      text: 'Thanks for registering with CloseBrace. You can confirm your account by visiting the following URL: https://closebrace.com/account/confirm?conf=' + userConfirm + ' ... If you did not sign up for CloseBrace and someone has used your email address by mistake, you don\'t need to do anything. This account will not be emailed again (unless a re-send of this confirmation email is requested), and will be automatically deleted in ten days.', // plaintext body
      html: '<h3>Welcome to CloseBrace</h3><p>Thanks for registering with CloseBrace, the tutorial and resource site for JavaScript developers, by JavaScript developers.</p><p>You can confirm your account by visiting the following URL: <a href="https://closebrace.com/account/confirm?conf=' + userConfirm + '" target="_blank">https://closebrace.com/account/confirm?conf=' + userConfirm + '</a></p><p>If you did not sign up for CloseBrace and someone has used your email address by mistake, you don\'t need to do anything. This account will not be emailed again (unless a re-send of this confirmation email is requested), and will be automatically deleted in ten days.</p>' // html body
    };

    // send mail
    mg.messages().send(mailOptions, (error, body) => {
      if (error) {
        req.flash('error', { title: 'Unable to send email', detail: error });
        return next();
      }
      req.flash('success', { detail: 'We\'ve re-sent your confirmation. Please check your email and click or copy-n-paste the provided link, which will make the notice below go away.'})
      res.redirect('/account/profile');
    });
  });

  view.render('account/profile');

};
