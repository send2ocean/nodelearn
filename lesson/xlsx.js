'use strict';
var xlsx = require('node-xlsx') ;
var fs = require('fs');
// Parse a buffer
var workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`./data/data.xls`));

console.log(workSheetsFromBuffer[0].data[0]);
// Parse a file
//const workSheetsFromFile = xlsx.parse(`${__dirname}/myFile.xlsx`);