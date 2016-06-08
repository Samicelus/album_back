'use strict';
var host_ip = "119.29.92.190";

angular.module('app', [])
.controller('AppController', ['$scope','$http', function($scope,$http) {
    	$scope.images = new Array();
    	$scope.refresh = function(albumName){
    		$scope.images = [];
			$http.get("http://"+host_ip+":8044/album/getImages?album="+albumName).then(function (response) {
				var imageList = response.data.data.imgs;
				for(var i in imageList){
					var imageObj = imageList[i];
					$scope.images.push(imageObj);
					}
				
			});
    	}

    	$scope.addAlbum = function(albumName){
 			$http({
				method:'post',
				url:'http://'+host_ip+':8044/album/addAlbum',
				data:{albumName:albumName}
				}).success(function(res){
					$scope.getAlbum();
					});   		
    		}
    	
     	$scope.toggle = function(x){
			x.width = x.width==100?400:100;
    		}


     	$scope.refreshPage = function(pageName){
			$http.get("http://"+host_ip+":8044/page/getPageConfig?pageName="+pageName).then(function (response) {
				$scope.pageConfig = response.data.data;
				$scope.pageSelected = true;
				});
    		}
		$scope.refreshPage('galleryPage');
		
     	$scope.getAlbum = function(){
			$http.get("http://"+host_ip+":8044/album/getAlbums").then(function (response) {
				var rst = response.data.data.albums;
				$scope.albumList = new Array();
				for(var i in rst){
					if(rst[i].albumName != "upload"){
						$scope.albumList.push(rst[i]);
						}
					}
				$scope.refresh($scope.albumList[0]);
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

    }]);
