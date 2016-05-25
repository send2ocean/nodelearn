/**
 在 fs 中，所有的同步（或者阻塞）的操作文件系统的方法名都会以 'Sync'
 结尾。要读取一个文件，你将需要使用  fs.readFileSync('/path/to/file')
 方法。这个方法会返回一个包含文件完整内容的 Buffer 对象。
 

 Buffer 对象是 Node 用来高效处理数据的方式，无论该数据是 ascii
 还是二进制文件，或者其他的格式。Buffer 可以很容易地通过调用 toString()
 方法转换为字符串。如：var str = buf.toString()。
 
**/
console.log('参数获取',process.argv)
var fs = require('fs');
/**
fs.readFileSync(file[, options])#
Synchronous version of fs.readFile. Returns the contents of the file.

If the encoding option is specified then this function returns a string. Otherwise it returns a buffer.
**/
var bf = fs.readFileSync('./data/demo.txt')
console.log('demo.txt content is :',bf.toString())
var content = bf.toString()
var lines = content.split('\n')
console.log('demo.txt rows count :',lines.length)

/**
  使用 fs.readFile() 方法，而不是
 fs.readFileSync()， 传入的回调函数中去收集数据（这些数据会
 作为第二参数传递给你的回调函数），而不是使用方法的返回值。想要学习更多关于
 回调函数的知识，请查阅：[https://github.com/maxogden/art-of-node#callbacks
 。](https://github.com/maxogden/art-of-node#callbacks。)

 记住，我们习惯中的 Node.js 回调函数都有像如下所示的特征：

    function callback (err, data) {   ...   }

 所以，你可以通过检查第一个参数的真假值来判断是否有错误发生。如果没有错误发
 生，你会在第二个参数中获取到一个 Buffer 对象。和 readFileSync()
 一样，你可以传入 'utf8'
 作为它的第二个参数，然后把回调函数作为第三个参数，这样，你得到的将会是一个
 字符串，而不是 Buffer。

**/
 
fs.readFile('./demo.txt','utf8', function (err, data) {
  if (err) throw err;
  console.log('Asyn read content ',data);
});


var content = undefined

function read(callback) {
  fs.readFile('demo.txt', function doneReading(err, fileContents) {
    content = fileContents
    callback()
  })
}

function printcontent() {
  console.log(content)
}

read(printcontent)


