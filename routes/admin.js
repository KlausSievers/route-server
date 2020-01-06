var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/android', function (req, res, next) {
  res.download('100-Stunden-Aktion.apk');
});

router.get('/clear', function (req, res, next) {
  db.coord.remove({});
  db.marker.remove({});
  res.send('DB cleared');
});

module.exports = router;