var express = require('express');
var db = require('../database');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  db.query('SELECT * FROM coord ORDER BY timestamp', function (err, result, fields) {
    res.jsonp(result);
  });
});

router.get('/:time', function (req, res, next) {
  console.log("Find coord by Time: " + parseInt(req.params.time));
  db.query('SELECT * FROM coord where timestamp > ' + parseInt(req.params.time) + " ORDER BY timestamp", function (err, result, fields) {
    if (err) {
      console.log(err);
    }
    console.log("Found: " + result.length);
    res.jsonp(result);
  });
});


router.post('/', function (req, res, next) {
  console.log("Add Coords: " + req.body);
  let coord = req.body;
  let statement = "INSERT INTO `coord` (`latitude`, `longitude`, `timestamp`) VALUES (" + coord.latitude + "," + coord.longitude + "," + Date.now() + ")";
  console.log(statement);
  db.query(statement, function (err, result, fields) {
    if (err) {
      console.log("Coords not saved");
      console.error(err);
    }
    else {
      console.log("Coords saved");
    }
  });
  res.status(200).end("");
});

module.exports = router;
