'use strict'
var BaseRouter = require('../libs/baseRoute');
var handler = require('../services/albumService.js');
var formidable = require('express-formidable');
var formidableMiddleware = formidable.parse({ uploadDir: './public/files/' });
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './public/files/' });
var services = [];

//添加一个专辑
services.push({
    type: 'post',
    url: '/addAlbum',
    handler: handler.addAlbum
});

//获取所有album
services.push({
    type: 'get',
    url: '/getAlbums',
    handler: handler.getAlbums
});

//添加一张图片
services.push({
    type: 'post',
    url: '/addImage',
    handler: handler.addImage
});

//获取专辑图片
services.push({
    type: 'get',
    url: '/getImages',
    handler: handler.getImages
});

//获取图片
services.push({
    type: 'get',
    url: '/getAllImages',
    handler: handler.getAllImages
});

//添加一张图片到指定专辑
services.push({
    type: 'post',
    url: '/addImageToAlbum',
    handler: handler.addImageToAlbum
});

//从指定专辑移除
services.push({
    type: 'post',
    url: '/removeImageFromAlbum',
    handler: handler.removeImageFromAlbum
});

//修改图片标题
services.push({
    type: 'post',
    url: '/changeAlt',
    handler: handler.changeAlt
});


//上传图片
services.push({
    type: 'post',
    url: '/uploading',
    middleware:formidableMiddleware,
    handler: handler.uploading
});

class Router extends BaseRouter{
    constructor(server,name) {
        super(server,name); //执行父类BaseRouter的构造函数
        this.services = services;
    }
}
module.exports = Router;