var fs      = require('fs');
var express = require('express');
var router  = express.Router();


router.get('/', function(req, res, next) {
  res.json({blah: 3});
});

module.exports = router;
