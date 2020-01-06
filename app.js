var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var https = require('https');
var fs = require('file-system');
var bodyParser = require('body-parser')


var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var coordRouter = require('./routes/coord');
var markerRouter = require('./routes/marker');

var app = express();

app.use(logger('common', {
  stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));
app.use(bodyParser.json({limit: '15mg'}));
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/coord', coordRouter);
app.use('/marker', markerRouter);

https.createServer({
  key: fs.readFileSync('cert/privateKey.key'),
  cert: fs.readFileSync('cert/certificate.crt')                              
}, app)
.listen(8090, function () {
  console.log('Serve Listen on 8090');
});

