var http = require('http');

/*Since most requests are GET requests without bodies, Node.js provides this convenience method. 
The only difference between this method and http.request() is*/
// API DOC BASE 
// https://nodejs.org/api/http.html
 that it sets the method to GET and calls req.end() automatically.
http.get("http://www.baidu.com", function(res) {
  		console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
  		console.log("Got error: " + e.message);
     }).on('data',function(data){
     	console.log('get  data',data)
     });