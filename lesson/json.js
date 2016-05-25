var fs = require('fs');
 
var bf = fs.readFileSync('./data/phones/phones.json')
 
var content = bf.toString();

var obj = JSON.parse(content);
// add a obj 
obj.push({'abc':'abcabc'})

var str = JSON.stringify(obj);

console.log(str);

	fs.writeFile('./data/phones/phones.json', str, (err) => {
  if (err) throw err;
	console.log('It\'s saved!');
});