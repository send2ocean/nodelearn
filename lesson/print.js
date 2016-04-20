var n=3;
var len=2*n-1;
for(var i=1;i<len+1;i++){
	var abs = Math.abs(n-i);
	var str="";
	for(var j=0;j<len;j++){		
		if(j==abs || Math.abs(len-j-1)==abs){
			str+="*";
		}else{
			str+=" ";
		}
	}
	console.log(str);
}