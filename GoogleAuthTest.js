console.log("Doug Top  of Test");

var google = require('googleapis');
var drive = google.drive('v2');
var request = require('request');
// Create the JWT client

//google.options({proxy: 'http://127.0.0.1:8888'});
var authClient = new google.auth.JWT("104336289544-qj5g3vcnab7geh3pqk7127mgfmor4nph@developer.gserviceaccount.com", "C:\\key.pem", null,
  ['https://www.googleapis.com/auth/drive https://spreadsheets.google.com/feeds https://docs.google.com/feeds']);
  //['https://www.googleapis.com/auth/drive https://spreadsheets.google.com/feeds https://docs.google.com/feeds']);



// Authorize it to produce an access token
authClient.authorize(function(err, tokens) {
    console.log("top of authorize");
  if(err) {
		  console.log("authorize returned error %s", JSON.stringify(err));

		  throw err;
  } else {
		console.log("No Error! %s", JSON.stringify(tokens));
  }

  console.log("Authorization Successful!");

  drive.files.list({ auth: authClient, q:"title = 'Starlight Suites Status'" }, function(err, resp) {
    if (err) {
	  console.log("got error on file list request %s", JSON.stringify(err));
	} else {
        console.log("listing successful: ", JSON.stringify(resp));
        console.log("items: " + JSON.stringify(resp.items)); 
        /*
        request({
            "method":"get",
            "url": resp.items[0].selfLink,
            "qs":{
                "key": key,
                "exportFormat": "csv",
                "gid": 0
            },
            "headers":{
                "Authorization": "Bearer " + token
            }
        }, function(err, response, body){
            console.log(response);
        });
        */
	}
  });

    var params = {
        q :"title = 'Starlight Suites Status'",
        access_token: tokens.access_token,
        fields: "items\/id,kind"
        
	};

    console.log("after defining params");
    
    var url =  'https://www.googleapis.com/drive/v2/files';

    console.log("after defining url");
    
    request.get({url:url, qs:params}, function(err, resp, body) {
        if (err) {
            console.log("Got Error: %s", JSON.stringify(err));
        } else {
            //debugger;

            //getFileContents(JSON.parse(body).selfLink, tokens.access_token);
            getQuery(JSON.parse(body).items[0].id, tokens.access_token);
        }
    });

    

    console.log("after file request registered");

});

function getFileContents(url, accesstoken) {
    console.log("Top of get file contents for url: %s", url);
    request({
        "method":"get",
        "url": url,
        "qs":{
            "key": accesstoken,
            "exportFormat": "csv",
            "gid": 0
        },
        "headers":{
            "Authorization": "Bearer " + accesstoken
        }
    }, function(err, response, body){
        if (err) {
            console.log("Got Error trying to get file contents: %s", JSON.stringify(err));
        } else {
            console.log("SUccess!!!");
            //console.log("Response = %s", JSON.stringify(response));
            //console.log("Body = %s", JSON.stringify(body));
        }
    });
}

function myHandler(json) {
    console.log("myHandler called!");
    debugger;
    json.table.rows.forEach(function(row) {
        console.log(row.c[3].v);
    });
}

function getQuery(id, accesstoken) {
    console.log("Top of query for id %s", id);
    //var url =  'https://docs.google.com/spreadsheets/d/' + id + '/gziv/tq';
    var url =  'https://spreadsheets.google.com/tq'
    console.log("trying to access url: %s", url);
    request({
        "method":"get",
        "url": url,
//        "key": id,
        "qs":{
            "key": id,
            "gid": 1,
            "tq": "",
            "tqx": 'responseHandler:myHandler',
        },
        "headers":{
            "Authorization": "Bearer " + accesstoken
        }
    }, function(err, response, body){
        if (err) {
            console.log("Got Error trying to get file contents: %s", JSON.stringify(err));
        } else {
            console.log("SUccess for TQ!!!");
            console.log("Response = %s", JSON.stringify(response));
            console.log("\n\n\n");
            console.log("Body = %s", JSON.stringify(body));

            // TODO: DEC - I know this is bad form, bbut just trying to get this working.
            eval(body);
            //debugger;
        }
    });
}
console.log("Bottom of Test");

