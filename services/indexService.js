var BaseService = require('../libs/baseService.js');
var utils = require('../libs/utils.js');
var service = new BaseService();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

//uploadPage
service.uploadPage = function(req, res){
	res.render('upload', { title: '上传测试代码' });
	}

service.galleryPage = function(req, res){
	res.render('gallery', { title: '图片库' });
	}

module.exports = service;
