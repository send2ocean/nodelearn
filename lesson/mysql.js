var mysql = require('mysql');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//var url = 'mongodb://localhost:27017/test';

//var url = 'mongodb://127.0.0.1:27017/baymax-mysql-to-mongo';
var url = 'mongodb://101.201.197.11:37000/baymaxd';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to mongo server.");
    db.close();
});

var connection = mysql.createConnection({
    host: '101.201.197.11',
    user: 'root',
    password: 'swiftiscool',
    database: 'Baymaxd_PatientFiles'
});

connection.connect();

var tableName = "symptoms";
console.log(tableName)
connection.query('select * from  ' + tableName, function(err, rows, fields) {
    if (err) throw err;

    MongoClient.connect(url, function(err, db) {
        var collection = db.collection(tableName);
        // Insert some documents 
        collection.insertMany(rows, function(err, result) {
            assert.equal(err, null);

            console.log("Inserted  documents into the " + tableName + " collection");
            db.close();
        });
    });


});

connection.end();
