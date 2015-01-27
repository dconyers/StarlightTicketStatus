module.exports.getDougState = getDougState;

var google  = require('googleapis');
var drive   = google.drive('v2');
var log4js  = require("log4js");
var Q       = require("q");
var request = require('request');

log4js.replaceConsole();
var logger = log4js.getLogger();

function getDougState() {
    getShowData();
    return "Cool";
}

function getShowData() {
    var authClient = new google.auth.JWT("104336289544-qj5g3vcnab7geh3pqk7127mgfmor4nph@developer.gserviceaccount.com", "keys/key.pem", null,
  ['https://www.googleapis.com/auth/drive https://spreadsheets.google.com/feeds https://docs.google.com/feeds']);
    
    
    
    // Authorize it to produce an access token
    var authMethod = Q.nbind(authClient.authorize, authClient);
    authMethod().then(function (tokens) {
        
        // TODO: DEC - This is bad code - don't use a global to workaround scoping issue
        tokens_ = tokens;
        logger.trace("top of then for authclient.authorize");
        
        logger.trace("No Error! %s", JSON.stringify(tokens));
        
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
        //debugger;
        //request.get({ url: url, qs: params }, function (err, resp, body) {
        //if (err) {
        //    logger.error("Got Error: %s", JSON.stringify(err));
        //} else {
        getQuery(JSON.parse(args[1]).items[0].id, tokens_.access_token);
            //}
        //});
      
    }).catch(function(error) {
        logger.error("Got error in Q handler", error);
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

function getQuery(id, accesstoken) {
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
    }, function (err, response, body) {
        if (err) {
            logger.trace("Got Error trying to get file contents: %s", JSON.stringify(err));
        } else {
            var obj = JSON.parse(
                body.replace(/new Date\((\d+),(\d+),(\d+)\)/g, function (str, y, m, d) { return "\"" + y + "-" + m + "-" + d + "T06:00:00.000Z\""; })
                .replace(/(,,)/g, function () { return ",null,"; })
            );
            myHandler(obj);
        }
    });
}