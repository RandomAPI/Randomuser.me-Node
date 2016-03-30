var fs      = require('fs');
var express = require('express');
var router  = express.Router();


router.get('/', function(req, res, next) {
  console.log(req.query);
  //res.send(api());
  res.setHeader('Content-Type', 'application/json');
  res.send(new Generator(req.query).generate());
});

module.exports = router;
