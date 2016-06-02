'use strict';


angular


    .module('app', ['angularFileUpload','ngAnimate','ui.bootstrap'])


    .controller('AppController', ['$scope','FileUploader','$http', function($scope, FileUploader,$http) {
    	$scope.images = new Array();
    	$scope.index = 0;
    	$scope.carouselLen = 0;
    	$scope.refresh = function(albumName){
    		$scope.images = [];
			$http.get("http://localhost:8044/album/getImages?album="+albumName).then(function (response) {
				var imageList = response.data.data.imgs;
				$scope.index = 0;
				$scope.carouselLen = imageList.length;
				$scope.carouselWidth = $scope.carouselLen*600 +"px";
				$scope.carouselLeft = "400px";
				for(var i in imageList){
					var imageObj = imageList[i];
					imageObj.width = "400px";
					if(i == 0){
						imageObj.childrenWidth = "112%";
						imageObj.marginTop = "20px";
						imageObj.rotation = "rotate3d(1,1,0,0deg)";
						}else{
							imageObj.childrenWidth = "100%";
							imageObj.marginTop = "0px";
							imageObj.rotation = "rotate3d(-0.5,1,0,-60deg)";
							}
					imageObj.divId = "img"+i;
					$scope.images.push(imageObj);
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

     	$scope.pre = function(){
     		if($scope.carouselLen != 0){
	     		$scope.index = $scope.index != 0?$scope.index-1:0;
				$scope.images[$scope.index+1].childrenWidth = "100%";
	     		$scope.images[$scope.index+1].marginTop = "0px";
	     		$scope.images[$scope.index+1].rotation = "rotate3d(-0.5,1,0,-60deg)";
	     		$scope.images[$scope.index].childrenWidth = "112%";
	     		$scope.images[$scope.index].marginTop = "20px";
	     		$scope.images[$scope.index].rotation = "rotate3d(1,1,0,0deg)";
	     		$scope.carouselLeft =  400-$scope.index*400+"px";	
	     		}
    		}

     	$scope.next = function(){
     		if($scope.carouselLen != 0){
	      		$scope.index = ($scope.index != ($scope.carouselLen-1))?$scope.index+1:$scope.carouselLen-1;
	     		$scope.images[$scope.index-1].childrenWidth = "100%";
	     		$scope.images[$scope.index-1].marginTop = "0px";
	     		$scope.images[$scope.index-1].rotation = "rotate3d(0.5,1,0,60deg)";
	     		$scope.images[$scope.index].childrenWidth = "112%";
	     		$scope.images[$scope.index].marginTop = "20px";
	     		$scope.images[$scope.index].rotation = "rotate3d(1,1,0,0deg)";
	     		$scope.carouselLeft =  400-$scope.index*400+"px";
	     		}
    		}

     	$scope.getAlbum = function(){
			$http.get("http://localhost:8044/album/getAlbums").then(function (response) {
				$scope.albumList = response.data.data;
				$scope.refresh($scope.albumList[0]);
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
      	
      	$scope.modalDisplay = function(y){
			$scope.modalShow = "block";
			$scope.modalSrc = y.imageURL;
			$scope.modalAlt = y.alt;
			$scope.displayAlt = y.alt;
    		}

      	$scope.modalHide = function(){
			$scope.modalShow = "none";
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
