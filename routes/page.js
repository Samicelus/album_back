'use strict'
var BaseRouter = require('../libs/baseRoute');
var handler = require('../services/indexService.js');

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

class Router extends BaseRouter{
    constructor(server,name) {
        super(server,name); //执行父类BaseRouter的构造函数
        this.services = services;
    }
}
module.exports = Router;