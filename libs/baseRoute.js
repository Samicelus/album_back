'use strict'

var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
class BaseRouter{
	constructor(server,name){
		this.server = server;
		this.router = router;
		this.name = name;
		this.services = [];
	}
	initRouter(){
		var _this = this;
		_this.services.forEach(function(service){
			var url = service.url;
			if(service.middleware){
				_this.router.use(service.middleware);
				}
			switch(service.type.toLowerCase()){
                case 'get':
					{
                    _this.router.get(url, service.handler);
                    break;
					}
                case 'post':
					{
                    _this.router.post(url, service.handler);
                    break;
					}
                case 'put':
					{
                    _this.router.put(url, service.handler);
                    break;
					}
                case 'del':
					{
                    _this.router.del(url, service.handler);
                    break;
					}
                default:
					{
                    //do nothing;
					break;
					}
				}
			});
			_this.server.use('/'+(_this.name == 'index' ? '' : _this.name),_this.router); //将文件名作为router的根路径，参见importer.js中相关代码
		}
}
module.exports = BaseRouter;