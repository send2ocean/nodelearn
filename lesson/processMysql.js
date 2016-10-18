var fs = require('fs');

var bf = fs.readFileSync('/Users/send2ocean/Documents/drug_info.json')

var content = bf.toString();

var obj = JSON.parse(content);

var jsons = "";
for (var i = obj.length - 1; i >= 0; i--) {
    var o = obj[i];
    /*
    if (o.aliases_cn) {
        var s = o.aliases_cn.split(",");
        o.aliases_cn = s;
        console.log(o);
    }else{
    	o.aliases_cn = [];
    }
    */
    jsons += JSON.stringify(o);

}

fs.writeFile('/Users/send2ocean/Documents/drug_info2.json', jsons, (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
});
