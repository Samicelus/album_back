var mongodb = require('../libs/mongodb.js');
var Page = require('../models/page.js');


var pages = [
	{
	pageName: "uploadPage",
	title: "图片上传",
	titleImg: ""
	},
	{
	pageName: "galleryPage",
	title: "画廊",
	titleImg: ""
	}
];

for(var i in pages){
	(function(pageConfig){
		new Page.schema(pageConfig).saveAsync().then(function(p){
			console.log(p);
		});
	})(pages[i]);
}

