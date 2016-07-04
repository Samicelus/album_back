'use strict';
var host_ip = "119.29.92.190";

angular.module('app', ['angularFileUpload','ngAnimate','ui.bootstrap'])
.controller('AppController', ['$scope','FileUploader','$http','$timeout', function($scope, FileUploader,$http, $timeout) {
		$scope.openid = "user's openid";
		$scope.addedFile = false;
    	$scope.deleteSuccess = false;
		$scope.deleteFail = false;
    	$scope.images = new Array();
    	$scope.pages = new Array();
    	$scope.pageConfig = new Object();
    	$scope.refresh = function(albumName){
    		$scope.getAlbum();
    		$scope.images = new Array();
			$http.get("http://"+host_ip+":8044/album/getImages?album="+albumName).then(function (response) {
				var imageList = response.data.data.imgs;
				for(var i in imageList){
					var imageObj = imageList[i];
					if(typeof(imageObj)=="object"){
						imageObj.width = 100;
						$scope.images.push(imageObj);						
						}else{
							console.info(typeof(imageObj));
							}
					}
				});
    	}
 
     	$scope.refreshPage = function(pageName){
			$http.get("http://"+host_ip+":8044/page/getPageConfig?pageName="+pageName).then(function (response) {
				$scope.pageConfig = response.data.data;
				$scope.pageSelected = true;
				});
    		}
 
    	$scope.getPages = function(){
			$http.get("http://"+host_ip+":8044/page/getPages").then(function (response) {
				$scope.pages = response.data.data.pages;
				console.info($scope.pages);
				});
    		}

    	$scope.addAlbum = function(albumName){
    		$scope.addedAlbumName = "";
 			$http({
				method:'post',
				url:'http://'+host_ip+':8044/album/addAlbum',
				data:{albumName:albumName}
				}).success(function(res){
					$scope.getAlbum();
					});   		
    	}
    	
		$scope.deleteAlbum = function(albumName){
 			$http({
				method:'post',
				url:'http://'+host_ip+':8044/album/deleteAlbum',
				data:{albumName:albumName}
				}).success(function(res){
					$scope.getAlbum();
					if(res.result == "FALSE"){
						$scope.deleteAlbumInfo = res.msg;
						$scope.deleteSuccess = false;
						$scope.deleteFail = true;
						var timer = $timeout(function(){
							$scope.deleteFail = false;
							$timeout.cancel(timer);
							},3000);
						}else{
							$scope.deleteAlbumInfo = res.data;
							$scope.deleteSuccess = true;
							$scope.deleteFail = false;
							var timer = $timeout(function(){
								$scope.deleteSuccess = false;
								$timeout.cancel(timer);
								},1000);
							}
					
					});   		
    	}
		
     	$scope.toggle = function(x){
			x.width = x.width==100?400:100;
    		}

     	$scope.getAlbum = function(){
			$http.get("http://"+host_ip+":8044/album/getAlbums").then(function (response) {
				$scope.albumList = response.data.data.albums;
				console.info($scope.albumList);
				});			
    		}

     	$scope.addImageToAlbum = function(id,albumName){
			$http({
				method:'post',
				url:'http://'+host_ip+':8044/album/addImageToAlbum',
				data:{img_id:id ,album:albumName}
				}).success(function(res){
					console.info(res);
					});
    		}


      	$scope.removeImageFromAlbum = function(id,albumName){
			$http({
				method:'post',
				url:'http://'+host_ip+':8044/album/removeImageFromAlbum',
				data:{img_id:id ,album:albumName}
				}).success(function(res){
					$scope.refresh(albumName);
					console.info(res);
					});
    		}

      	$scope.changeAlt = function(id,alt){
			$http({
				method:'post',
				url:'http://'+host_ip+':8044/album/changeAlt',
				data:{img_id:id ,alt:alt}
			}).success(function(res){
					console.info(res);
					});
    		}

		$scope.getAlbum();
		$scope.getPages();
		
		$scope.status = {
			isUploadOpen: false,
			isUpListOpen: false,
			isPageConfigOpen: false
			};


        var uploader = $scope.uploader = new FileUploader({
            url: 'http://'+host_ip+':8044/album/uploading',
            headers : {'openid':$scope.openid}
        });
        
        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            //console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
        	//fileItem.file.name += item.file.extName;
            //console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
           //console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            //console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
        	$scope.refresh('upload');
            //console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            //console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            //console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            //console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            //console.info('onCompleteAll');
        };


        //修改页面设置
        $scope.modPageConfig = function(){
			$http({
				method:'post',
				url:'http://'+host_ip+':8044/page/pageConfig',
				data:{pageName:$scope.pageConfig.pageName,title:$scope.pageConfig.title}
				}).success(function(res){
					console.info(res);
					});
    		}	
        
    }]);
