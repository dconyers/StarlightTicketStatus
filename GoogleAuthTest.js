console.log("Top  of Test");

var google = require('googleapis');
var drive = google.drive('v2');
// Create the JWT client
var authClient = new google.auth.JWT("104336289544-qj5g3vcnab7geh3pqk7127mgfmor4nph@developer.gserviceaccount.com", "C:\\key.pem", null,
  ['https://www.googleapis.com/auth/drive']);



// Authorize it to produce an access token
authClient.authorize(function(err, tokens) {
  if(err) {
		  console.log("authorize returned error");
		  throw err;
  } else {
		  console.log("No Error!");
  }

  console.log("It might have worked");

  drive.files.list({ auth: authClient }, function(err, resp) {
    if (err) {
	  console.log("got error on file list request");
	} else {
	  console.log("listing successful: " + JSON.stringify(resp));
	}
  });


});

console.log("Bottom of Test");
