var fs      = require('fs');
var express = require('express');
var router  = express.Router();

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
    res.render('pages/' + page, {title: titles[page]});
  } else {
    next();
  }
});

router.all('/download/version.php', function(req, res, next) {
  res.json({"version": "3.0.0"});
});

module.exports = router;
