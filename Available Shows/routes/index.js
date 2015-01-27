var express = require('express');
var router = express.Router();
var spreadsheetAccess = require('../public/javascripts/SpreadsheetAccess');


var status = spreadsheetAccess.getDougState();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express', cool: status,});
});

module.exports = router;