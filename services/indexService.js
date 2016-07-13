var BaseService = require('../libs/baseService.js');
var utils = require('../libs/utils.js');
var service = new BaseService();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var Page = require('../models/page.js');
//uploadPage
service.uploadPage = function(req, res){
	res.render('upload', { title: '上传测试代码' });
	}

service.uploadimg = function(req, res){
	res.render('uploadimg', { title: '上传图片' });
	}

service.galleryPage = function(req, res){
	res.render('gallery', { title: '图片库' });
	}

service.galleryPage2 = function(req, res){
	res.render('gallery2', { title: '图片库2' });
	}

service.font_test = function(req, res){
	res.render('font_test', { title: '字体测试' });
	}

service.pageConfig = function(req, res){
	var pageName = req.body.pageName;
	var title = req.body.title; 
    Page.schema.find({pageName:pageName}).execAsync().then(function(bars){
    	if(bars.length == 0){
    		//新建
    		return Page.schema({pageName:pageName,title:title}).saveAsync();
    		}else{
    			//修改
    			var pageData = bars[0];
    			pageData.title = title;
    			return pageData.saveAsync();
    			}
	    }).then(function(pageData){
	    	service.restSuccess(res, pageData);
	    	}).catch(function(e){
		        //error(e.stack || e);
		        service.restError(res, -1, e.stack);
		   		});
	}

//获取所有page
service.getPages = function(req, res){
    Page.schema.find().execAsync().then(function(bars){
    	var pages = JSON.parse(JSON.stringify(bars));
		service.restSuccess(res, {pages:pages,len:pages.length});	
    }).catch(function(e){
        //error(e.stack || e);
        service.restError(res, -1, e.stack);
    });
}

//获取专辑所有图片
service.getPageConfig = function(req, res){
	var pageName = req.query.pageName;
	var condition = {pageName:pageName};
    Page.schema.findOne(condition).execAsync().then(function(pageData){
    	var pageConfig = JSON.parse(JSON.stringify(pageData));
		service.restSuccess(res, pageConfig);	
    }).catch(function(e){
        //error(e.stack || e);
        service.restError(res, -1, e.stack);
    });
}


module.exports = service;
