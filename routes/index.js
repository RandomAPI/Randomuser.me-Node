var fs      = require('fs');
var express = require('express');
var router  = express.Router();

var views;
fs.readdir('views', function(err, data) {;
  views = data;
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:page?', function(req, res, next) {
  var page = req.params.page;
  
  if (page === undefined) {
    res.render('index');
  } else if (views.indexOf(page + ".ejs") !== -1) {
    res.render(page);
  } else {
    next();
  }
});

module.exports = router;
