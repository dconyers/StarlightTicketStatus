module.exports.getJSONShowData = getJSONShowData;

var google = require('googleapis');
var drive = google.drive('v2');
var log4js = require("log4js");
var Q = require("q");
var request = require('request');

log4js.replaceConsole();
var logger = log4js.getLogger();

function getJSONShowData(callback) {
    var tokens_;    
    getShowData();
    
    function getShowData() {
        var authClient = new google.auth.JWT("104336289544-qj5g3vcnab7geh3pqk7127mgfmor4nph@developer.gserviceaccount.com", "keys/key.pem", null,
            ['https://www.googleapis.com/auth/drive https://spreadsheets.google.com/feeds https://docs.google.com/feeds']);
        
        // Authorize it to produce an access token
        var authMethod = Q.nbind(authClient.authorize, authClient);
        authMethod().then(function (tokens) {
            
            tokens_ = tokens;
            logger.trace("Authorization Successful!");
            
            var params = {
                q : "title = 'Starlight Suites Status'",
                access_token: tokens.access_token,
                fields: "items\/id,kind"
            };
            var url = 'https://www.googleapis.com/drive/v2/files';
            
            return Q.nfcall(request.get, { url: url, qs: params });
        }).then(function (args) {
            logger.trace("then for nfcall response");
            return Q.nfcall(getQuery, JSON.parse(args[1]).items[0].id, tokens_.access_token);
        }).then(function (body) {
            
            logger.debug("Got body %s", body);
            var obj = JSON.parse(body[1].replace(/new Date\((\d+),(\d+),(\d+)\)/g, function (str, y, m, d) { return "\"" + y + "-" + m + "-" + d + "T06:00:00.000Z\""; }).replace(/(,,)/g, function () { return ",null,"; }));
            myHandler(obj);
            callback(null, obj);
        }).catch(function (error) {
            logger.error("Got error in Q handler", error);
            callback(error);
        }).finally(function () {
            logger.trace("finally call");
        }).done();
    }
    
    function myHandler(json) {
        logger.trace("myHandler called!");
        json.table.rows.forEach(function (row) {
            logger.trace(row.c[0].v);
        });
    }
    
    function getQuery(id, accesstoken, callback) {
        logger.trace("Top of query for id %s", id);
        var url = 'https://spreadsheets.google.com/tq'
        logger.trace("trying to access url: %s", url);
        request({
            "method": "get",
            "url": url,
            "qs": {
                "key": id,
                "gid": 1,
                "tq": "",
                "tqx": 'responseHandler:myHandler',
            },
            "headers": {
                "Authorization": "Bearer " + accesstoken,
                "X-DataSource-Auth": "true"
            }
        }, callback);
    }
}
