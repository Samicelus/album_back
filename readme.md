接口

图片上传：
url: 	119.29.92.190:8044/uploading
方法:		POST
参数:		file		上传的文件结构体
		file.name	重命名的文件名字,包含其扩展名
		file.path	上传文件路径,可不填,使用默认上传路径
header:	openid		用户的openid,上传后的图片将会归为openid名下的图片集中