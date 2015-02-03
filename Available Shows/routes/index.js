var express = require('express');
var router = express.Router();
var spreadsheetAccess = require('../public/javascripts/SpreadsheetAccess');
var Q = require("q");

var log4js = require("log4js");
var logger = log4js.getLogger();



/* GET home page. */
router.get('/', function (req, res) {
    
    Q.nfcall(spreadsheetAccess.getJSONShowData).then(function (jsonData) {
        logger.trace("successfully retrieved JSON data");
        res.render('index', { title: 'Express', showData: jsonData });
    }).catch(function (error) {
        logger.error("Got error trying to render", error);
    }).done();


    //var status = spreadsheetAccess.getJSONShowData(dougRenderer);
    //function dougRenderer(error, jsonData) {
//        res.render('index', { title: 'Express', cool: jsonData});
        
    //}
    
});


module.exports = router;