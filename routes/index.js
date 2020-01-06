var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '100-Stunden-Aktion 2019' });
});

module.exports = router;
