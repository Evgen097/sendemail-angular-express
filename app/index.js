var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var compression = require('compression');
var router = require('./routes/router');

var path = require('path');


var appRoot = require('app-root-path');

process.on('uncaughtException', function(error) {
    console.log('uncaughtException');
    console.log(error);
});


app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(compression());

app.use('/api.v1', router);


app.all('*', function (req, res) {
    res.status(404);
    res.json({msg: 'Ошибка, данного пути не существует!'});
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});








