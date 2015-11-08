var filterDir = require('./modle');

var dir = 'D:/GitProject/nodelearn/lesson';
var ext='txt';
// 调用模块练习
 filterDir(dir,ext,function(err,list){
 	if(err) throw err;
 	console.log(list);
 })