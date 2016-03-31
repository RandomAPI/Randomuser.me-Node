var fs      = require('fs');
var express = require('express');
var router  = express.Router();
var cors    = require('cors');


router.get('/', cors(), function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(new Generator(req.query).generate());
});

module.exports = router;
