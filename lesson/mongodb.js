var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//var url = 'mongodb://localhost:27017/test';
var url = 'mongodb://10.180.2.79:27017/test';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  insertDocument(db, function() {
      db.close();
  });
});

var insertDocument = function(db, callback) {
   db.collection('restaurants').insertOne( {
      "address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      },
      "borough" : "Manhattan",
      "cuisine" : "Italian",
      "grades" : [
         {
            "date" : new Date("2014-10-01T00:00:00Z"),
            "grade" : "A",
            "score" : 11
         },
         {
            "date" : new Date("2014-01-16T00:00:00Z"),
            "grade" : "B",
            "score" : 17
         }
      ],
      "name" : "Vella",
      "restaurant_id" : "41704620"
   }, function(err, result) {
    assert.equal(err, null);
    //console.log(result);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  });
};

var findRestaurants = function(db, callback) {
   //var cursor =db.collection('restaurants').find( );
   //var cursor =db.collection('restaurants').find( { "borough": "Manhattan" , "address.zipcode": "10075" ,"grades.grade": "B" ,"grades.score": { $gt: 30  } } );
   //var cursor =db.collection('restaurants').find( { "borough": "Manhattan" , "address.zipcode": "10075" ,"grades.grade": "B" ,"grades.score": { $lt: 10  } } );
   //1 for ascending and -1 for descending.
   var cursor =db.collection('restaurants').find({ "borough": "Manhattan" , "address.zipcode": "10075" ,"grades.grade": "B" ,"grades.score": { $lt: 10  } } ).sort( { "borough": 1, "address.zipcode": 1 } );
   // var cursor =db.collection('restaurants').find(
   //     { $or: [ { "cuisine": "Italian" }, { "address.zipcode": "10075" } ] }
   // );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findRestaurants(db, function() {
      db.close();
  });
});




// var updateRestaurants = function(db, callback) {
//    db.collection('restaurants').updateOne(
//       { "name" : "Juni" },
//       {
//         $set: { "cuisine": "American (New)" },
//         $currentDate: { "lastModified": true }
//       }, function(err, results) {
//       console.log(results);
//       callback();
//    });
// };
// var updateRestaurants = function(db, callback) {
//    db.collection('restaurants').updateMany(
//       { "address.zipcode": "10016", cuisine: "Other" },
//       {
//         $set: { cuisine: "Category To Be Determined" },
//         $currentDate: { "lastModified": true }
//       }
//       ,
//       function(err, results) {
//         console.log(results);
//         callback();
//    });
// };

var updateRestaurants = function(db, callback) {
   db.collection('restaurants').replaceOne(
      { "restaurant_id" : "41704620" },
      {
        "name" : "Vella 2",
        "address" : {
           "coord" : [ -73.9557413, 40.7720266 ],
           "building" : "1480",
           "street" : "2 Avenue",
           "zipcode" : "10075"
        }
      },
      function(err, results) {
        console.log(results);
        callback();
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  updateRestaurants(db, function() {
      db.close();
  });
});




var removeRestaurants = function(db, callback) {
   db.collection('restaurants').deleteMany(
      { "borough": "Manhattan" },
      function(err, results) {
         console.log(results);
         callback();
      }
   );
};

var removeRestaurants = function(db, callback) {
   db.collection('restaurants').deleteOne(
      { "borough": "Queens" },
      function(err, results) {
         console.log(results);
         callback();
      }
   );
};

var removeRestaurants = function(db, callback) {
   db.collection('restaurants').deleteMany( {}, function(err, results) {
      console.log(results);
      callback();
   });
};

var dropRestaurants = function(db, callback) {
   db.collection('restaurants').drop( function(err, response) {
      console.log(response)
      callback();
   });
};

//Aggreation 
//Index 