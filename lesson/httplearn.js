var http = require('http');
const https = require('https');
/*Since most requests are GET requests without bodies, Node.js provides this convenience method. 
The only difference between this method and http.request() is*/
// API DOC BASE 
// https://nodejs.org/api/http.html
//that it sets the method to GET and calls req.end() automatically.



http.get("http://www.baidu.com", function(res) {
  		console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
  		console.log("Got error: " + e.message);
     }).on('data',function(data){
     	console.log('get  data',data)
     });

//just a dmeo.for backup...aha

const url = "http://172.19.44.63:8080/?action=snapshot";


function faceDetecJson(){
  console.log("detect ....")
  let post_data =  {"url" : "http://i.meizitu.net/2014/09/28mt01.jpg"};
  let postData = JSON.stringify(post_data);
  console.log(postData);
  var options = {
    hostname: 'westus.api.cognitive.microsoft.com',
    //port: 80,
    path: '/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': "your key"
    }
  };

  let req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

function faceDetecStream(postData,io){
  console.log("detect stream....")

  //let postData = fs.readFileSync('./logonew.png')
  //console.log(postData);
  var options = {
    hostname: 'westus.api.cognitive.microsoft.com',
    //port: 80,
    path: '/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses',
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': "your key",
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  let req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      let faces = JSON.parse(chunk);
      let snow = Date.now()

      if(faces.length){
        io.emit('face detected', snow);
        fs.writeFile("./public/snapshots/"+snow+".jpeg", postData, "binary", function(err){
            if(err){
                console.log("write img file failed");
                throw err;
            }
            console.log("write img file success");
        });

        fs.writeFile("./public/snapshots-json/"+snow+".json", chunk, (err) => {
          if(err){
              console.log("json data save fail");
              throw err;
          }
          console.log("json data save success");
        });
      }

    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
    req.end();
  });

  // write data to request body
  req.write(postData);
  req.end();
}


function snapImage(io){
  console.log('starting snap image from server')


  var req = http.get(url, function(res){

      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];
      console.log(statusCode)
      let error;
      if (statusCode !== 200) {
       error = new Error(`Request Failed.\n` +
                         `Status Code: ${statusCode}`);
      }
      if (error) {
       console.log(error.message);
       // consume response data to free up memory
       res.resume();
       return;
      }
      let imgData = "";

      res.setEncoding("binary");


      res.on("data", function(chunk){
          imgData+=chunk;
      });

      res.on("end", function(){

          const buf1 = Buffer.from(imgData,"ascii");
          io.emit('face detect', "msg snapimg");
          faceDetecStream(buf1,io)
		      console.log('snap ended');
      });

      res.on('error', (e) => {

        console.log(`Got error: ${e.message}`);

      });
  });
  req.on('error', (e) => {
    console.log(`Get image buffer failed: ${e.message}`);
  });

}
module.exports= snapImage;
