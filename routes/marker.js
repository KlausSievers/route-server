var express = require('express');
var db = require('../database');
var fs = require('file-system');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  db.query('SELECT * FROM marker ORDER BY timestamp', function (err, result, fields) {
    res.jsonp(result);
  });
});

router.get('/:time', function (req, res, next) {
  console.log("Find marker by Time: " + parseInt(req.params.time));
  db.query('SELECT * FROM marker where timestamp > ' + parseInt(req.params.time) + " ORDER BY timestamp", function (err, result, fields) {
    if (err) {
      console.log(err);
    }
    console.log("Found: " + result.length);
    res.jsonp(result);
  });
});

router.post('/', function (req, res, next) {
  //console.log("Add Marker: " + JSON.stringify(req.body));
  let marker = req.body;

  let imgName = null;
  if(marker.img){
    imgName = Date.now()+'.png';
    fs.writeFile('/home/map100h/map100Server/public/img/'+imgName, marker.img, {encoding: 'base64'}, function(err) {
      console.error(err);
    });
  }

  let statement = "INSERT INTO `marker` (`latitude`, `longitude`, `timestamp`, `text`, `img`) VALUES (" + marker.latitude + "," + marker.longitude + "," + Date.now() + ",'" + marker.text +  "','"+ imgName + "');";
  console.log(statement);
  db.query(statement, function (err, result, fields) {
    if (err) {
      console.log("Marker not saved");
      console.error(err);
    }
    else {
      console.log("Marker saved");
    }
  });
  res.status(200).end("");
});

module.exports = router;
