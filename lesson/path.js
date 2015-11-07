var path = require('path');
var fs = require('fs');

// 打印目录下 指定扩展名的文件列表
// API DOC URL 
//https://nodejs.org/api/fs.html#fs_fs_readdir_path_callback AND
//https://nodejs.org/api/path.html
var dir = 'D:/NodeApp/nodelearn/lesson';
var ext='.txt';
var filelist;
function getlist(callback){
	fs.readdir(dir, function(err,list){
	if(err) throw err;
	console.log('dirs',list)
	filelist=list
	callback()
    })
}
function getextlist(){
	for(var i=0;i<filelist.length;i++) {
		if(path.extname(filelist[i]) ===ext )  console.log('txt is   ',filelist[i])
	}
	
}
getlist(getextlist);
