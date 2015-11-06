var express = require('express')
var app = express()
 
var wechat = require('wechat');
var config = {
  token: 'zdFzDf',
  appid: 'wx9502bfb962269a40',
  encodingAESKey: 'hIJ2W8DRq0YneakU5xJLomse9fXxUwvD7pdmXLA7zaE'
};

app.use(express.query());

app.get('/', function (req, res) {
  res.send('Hello WeChat')
})
//加密模式下wechat(token) 的 token 为config 
app.use('/webchat', wechat(config).text(function (message, req, res, next) {
	console.log('weixin message',message)
	res.reply('Hello world!');
	// 或者
	//res.reply({type: "text", content: 'Hello world!'});
}).image(function (message, req, res, next) {
	  res.reply({
	  type: "image",
	  content: {
		mediaId: 'mediaId'
	  }
	});
}).voice(function (message, req, res, next) {
	 res.reply({
	  type: "voice",
	  content: {
		mediaId: 'mediaId'
	  }
	});
}).video(function (message, req, res, next) {
	  res.reply({
	  type: "video",
	  content: {
		title: '来段视频吧',
		description: '女神与女汉子',
		mediaId: 'mediaId'
	  }
	});
}).location(function (message, req, res, next) {
	  res.reply({
	  title: "来段音乐吧",
	  description: "一无所有",
	  musicUrl: "http://mp3.com/xx.mp3",
	  hqMusicUrl: "http://mp3.com/xx.mp3",
	  thumbMediaId: "thisThumbMediaId"
	});
}).link(function (message, req, res, next) {
	   res.reply([
	  {
		title: '你来我家接我吧',
		description: '这是女神与高富帅之间的对话',
		picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
		url: 'http://nodeapi.cloudfoundry.com/'
	  }
	]);
}).event(function (message, req, res, next) {
  // TODO
}).device_text(function (message, req, res, next) {
  // TODO
}).device_event(function (message, req, res, next) {
  // TODO
}).middlewarify());

app.listen(3000)
console.log('server listen on port 3000')