var fs       = require('fs');
var express  = require('express');
var router   = express.Router();
var settings = require('../settings');

var stripe = require("stripe")(
  settings.stripePrivateKey
);

var views;
fs.readdir('.viewsMin/pages', function(err, data) {;
  views = data;
});

var titles = {
  changelog: 'Change Log',
  copyright: 'Copyright',
  documentation: 'Documentation',
  donate: 'Donate',
  index: 'Home',
  photos: 'Photos',
  photoshop: 'Photoshop Extension',
  sketch: 'Sketch Extension',
  stats: 'Statistics'
};

router.get('/', function(req, res, next) {
  res.render('pages/index', {title: 'Home'});
});

router.get('/:page?', function(req, res, next) {
  var page = req.params.page;

  if (page === 'index') {
    res.redirect(301, '/');
  } else if (views.indexOf(page + '.ejs') !== -1) {
    res.render('pages/' + page, {socket: ':' + settings.socket, title: titles[page], stripePublishKey: settings.stripePublishKey});
  } else {
    next();
  }
});

router.post('/donate', function(req, res, next) {
  let data = JSON.parse(req.body.data);

  stripe.charges.create({
    amount: data.price,
    currency: "usd",
    source: data.id, // obtained with Stripe.js
    description: "Donation from " + data.email
  }, function(err, charge) {
    if (err) return res.sendStatus(400);
    else res.sendStatus(200);
  });

});

router.all('/download/version.php', function(req, res, next) {
  res.json({"version": "3.0.1"});
});

module.exports = router;
