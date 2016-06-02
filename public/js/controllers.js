'use strict';


angular


    .module('app', ['angularFileUpload','ngAnimate','ui.bootstrap'])


    .controller('AppController', ['$scope','FileUploader','$http', function($scope, FileUploader,$http) {
    	$scope.images = new Array();
    	$scope.refresh = function(albumName){
    		$scope.getAlbum();
    		$scope.images = new Array();
			$http.get("http://localhost:8044/album/getImages?album="+albumName).then(function (response) {
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
    	
     	
    	$scope.addAlbum = function(albumName){
 			$http({
				method:'post',
				url:'http://127.0.0.1:8044/album/addAlbum',
				data:{albumName:albumName}
				}).success(function(res){
					$scope.getAlbum();
					});   		
    	}

     	$scope.toggle = function(x){
			x.width = x.width==100?400:100;
    		}

     	$scope.getAlbum = function(){
			$http.get("http://localhost:8044/album/getAlbums").then(function (response) {
				$scope.albumList = response.data.data;
				});			
    		}

     	$scope.addImageToAlbum = function(id,albumName){
			$http({
				method:'post',
				url:'http://127.0.0.1:8044/album/addImageToAlbum',
				data:{img_id:id ,album:albumName}
				}).success(function(res){
					$scope.refresh(albumName);
					console.info(res);
					});
    		}


      	$scope.removeImageFromAlbum = function(id,albumName){
			$http({
				method:'post',
				url:'http://127.0.0.1:8044/album/removeImageFromAlbum',
				data:{img_id:id ,album:albumName}
				}).success(function(res){
					$scope.refresh(albumName);
					console.info(res);
					});
    		}

      	$scope.changeAlt = function(id,alt){
			$http({
				method:'post',
				url:'http://127.0.0.1:8044/album/changeAlt',
				data:{img_id:id ,alt:alt}
			}).success(function(res){
					console.info(res);
					});
    		}

		$scope.getAlbum();
		$scope.status = {
			isUploadOpen: false,
			isUpListOpen: false
			};


        var uploader = $scope.uploader = new FileUploader({
            url: 'http://127.0.0.1:8044/album/uploading'
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

        //console.info('uploader', uploader);
    }]);
