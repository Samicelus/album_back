'use strict'
var BaseRouter = require('../libs/baseRoute');
var handler = require('../services/indexService.js');
var formidable = require('express-formidable');
var formidableMiddleware = formidable.parse({ uploadDir: './public/pageConfig/' });
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './public/pageConfig/' });
var services = [];

//render uploadPage
services.push({
    type: 'get',
    url: '/uploadPage',
    handler: handler.uploadPage
});

//render galleryPage
services.push({
    type: 'get',
    url: '/galleryPage',
    handler: handler.galleryPage
});

//pageConfig
services.push({
    type: 'post',
    url: '/pageConfig',
    handler: handler.pageConfig
});

//get Pages
services.push({
    type: 'get',
    url: '/getPages',
    handler: handler.getPages
});

//get pageConfig
services.push({
    type: 'get',
    url: '/getPageConfig',
    handler: handler.getPageConfig
});


class Router extends BaseRouter{
    constructor(server,name) {
        super(server,name); //执行父类BaseRouter的构造函数
        this.services = services;
    }
}
module.exports = Router;