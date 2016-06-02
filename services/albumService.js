var BaseService = require('../libs/baseService.js');
var utils = require('../libs/utils.js');
var service = new BaseService();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

var Album = require('../models/album.js');
var Image = require('../models/image.js');

//添加一个album
service.addAlbum = function(req, res){
	var albumName = req.body.albumName; 
    Album.schema.count({albumName: albumName}).execAsync().then(function(num){
		if(num!=0){
			service.restError(res, -1, '该物品类型名称已存在');
			}else{
				new Album.schema({albumName:albumName}).saveAsync().then(function(data){
					service.restSuccess(res, data);	
					});
				}  
    }).catch(function(e){
        //error(e.stack || e);
        service.restError(res, -1, e.stack);
    });
}

//获取所有album
service.getAlbums = function(req, res){
    Album.schema.find().execAsync().then(function(bars){
		service.restSuccess(res, bars);	
    }).catch(function(e){
        //error(e.stack || e);
        service.restError(res, -1, e.stack);
    });
}

//添加一个图片
service.addImage = function(req, res){
	var imageURL = req.body.imageURL;
	var width = req.body.width; 
	var length = req.body.length;
	var alt = req.body.alt;
    new Image.schema({imageURL:imageURL,width:width,length:length,alt:alt}).execAsync().then(function(img){
		service.restSuccess(res, img);
    }).catch(function(e){
        //error(e.stack || e);
        service.restError(res, -1, e.stack);
    });
}

//获取专辑所有图片
service.getImages = function(req, res){
	var album = req.query.album;
	var albums = new Array();
	albums.push(album);
	var condition = {albums:{$in:albums}};
    Image.schema.find(condition).execAsync().then(function(bars){
		service.restSuccess(res, {imgs:bars,len:bars.length});	
    }).catch(function(e){
        //error(e.stack || e);
        service.restError(res, -1, e.stack);
    });
}

//获取专辑所有图片
service.getAllImages = function(req, res){
	var page = Number(req.query.page);
	var pageSize = Number(req.query.pageSize);
	var alt = req.query.alt;
	var condition = {alt:{$regex:alt}};
    Image.schema.find(condition).skip((page - 1) * pageSize).limit(pageSize).execAsync().then(function(bars){   	
		res.setHeader("Access-Control-Allow-Origin","*");
		res.setHeader("Access-Control-Allow-Methods","GET");
		res.setHeader("Access-Control-Allow-Headers","x-requested-with,content-type");
		service.restSuccess(res, bars);	
    }).catch(function(e){
        //error(e.stack || e);
        service.restError(res, -1, e.stack);
    });
}

//添加一张图片到指定专辑
service.addImageToAlbum = function(req, res){
	res.setHeader("Access-Control-Allow-Origin","*");
	res.setHeader("Access-Control-Allow-Methods","POST");
	res.setHeader("Access-Control-Allow-Headers","X-Requested-With");
	var album = req.body.album;
	var img_id= req.body.img_id;
	var query = Image.schema.update({_id:img_id},{$addToSet:{albums:album}});
	query.execAsync().then(function(err,data){
		console.log(data);
		service.restSuccess(res, data);	
		}).catch(function(e){
	        //error(e.stack || e);
	        service.restError(res, -1, e.stack);
	    	});
}

//从指定专辑移除
service.removeImageFromAlbum = function(req, res){
	res.setHeader("Access-Control-Allow-Origin","*");
	res.setHeader("Access-Control-Allow-Methods","POST");
	res.setHeader("Access-Control-Allow-Headers","X-Requested-With");
	var album = req.body.album;
	var img_id= req.body.img_id;
	
	console.log(album);
	Image.schema.findOne({_id:img_id},{albums:1}).execAsync().then(function(data){
		var albums = JSON.parse(JSON.stringify(data)).albums;
		for(var i in albums){
			if(albums[i] == album){
				albums.splice(i,1);
				}
		}
		var query = Image.schema.update({_id:img_id},{$set:{albums:albums}});
		query.execAsync().then(function(err,data){
			//console.log(data);
			service.restSuccess(res, data);	
			}).catch(function(e){
		        //error(e.stack || e);
		        service.restError(res, -1, e.stack);
		    	});		
		}).catch(function(e){
	        //error(e.stack || e);
	        service.restError(res, -1, e.stack);
	    	});
}

//添加一张图片到指定专辑
service.changeAlt = function(req, res){
	res.setHeader("Access-Control-Allow-Origin","*");
	res.setHeader("Access-Control-Allow-Methods","POST");
	res.setHeader("Access-Control-Allow-Headers","X-Requested-With");
	var alt = req.body.alt;
	var img_id= req.body.img_id;
	var query = Image.schema.update({_id:img_id},{$set:{alt:alt}});
	query.execAsync().then(function(err,data){
		console.log(data);
		service.restSuccess(res, data);	
		}).catch(function(e){
	        //error(e.stack || e);
	        service.restError(res, -1, e.stack);
	    	});
}

//上传图片
service.uploading = function(req, res){
  // don't forget to delete all req.files when done
	var uploadedPath = req.body.file.path;
	var orgFilename = req.body.file.name;
	var savedFileName = orgFilename;
	var dstPath = './public/files/'+ savedFileName;
	var server = '127.0.0.1:8044';
	var fileUrl = server+dstPath;
	//重命名为真实文件名
	fs.rename(uploadedPath, dstPath,function(err){
		if(err){
			fs.unlink(uploadedPath,function(){
				service.restError(res, -1, 'rename error: '+err);
				});
			}else{
				fs.unlink(uploadedPath,function(){
					//下面往数据库中存储url
					var saveObj = new Object();
					saveObj.imageURL = 'http://'+server+'/files/'+savedFileName;
					saveObj.alt = savedFileName.slice(0,savedFileName.lastIndexOf('.'))
					saveObj.albums = ['upload'];
					new Image.schema(saveObj).saveAsync().then(function(data){
						service.restSuccess(res, 'file saved');	
						});	
					});
				}	
		});
	}

module.exports = service;
