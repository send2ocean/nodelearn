var fs = require('fs');
 
var bf = fs.readFileSync('./data/premax.json')
 
var content = bf.toString();
//
var myobject = JSON.parse(content);
console.log("*******************************")
 

function parse(path, myobject ){

	for(var attributeName in myobject){

		if(typeof(myobject[attributeName]) === 'object'){
			console.log("---"+attributeName+"----")
			parse(path+"."+attributeName,myobject[attributeName]);
		}else{
			//TODO write you business....
			if("Male" === myobject[attributeName]){
				myobject[attributeName] = "I Changed";
			}
			console.log(path+"."+attributeName+": "+myobject[attributeName]);
		}
		 
	}
}

parse("myobject",myobject)

var str = JSON.stringify(myobject);

 