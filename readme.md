接口

图片上传：
url: 	119.29.92.190:8044/uploading
方法:		POST
参数:		file		上传的文件结构体
		file.name	重命名的文件名字,包含其扩展名
		file.path	上传文件路径,可不填,使用默认上传路径
header:	openid		用户的openid,上传后的图片将会归为openid名下的图片集中

新增图片集（初始化我的图片）：
url: 	119.29.92.190:8044/addAlbum
方法:		POST
参数:		albumName	图片集名称,该接口应该在用户注册绑定openid的时候调用,图片集名称为他的openid

获取图片集的图片（获取我的图片）：
url: 	119.29.92.190:8044/getImages?album=【album】
方法:		GET
参数:		【album】	图片集名称,传入openid即可获取同名图片集下图片列表