var BaseModel = require('../libs/baseModel.js');
var model = new BaseModel();

var _Schema = new model.Schema({
	imageURL: String,			//图片链接
	albums: Array,				//所在专辑名
	width: String,				//图片宽度
	length: String,				//图片高度
	alt:String					//图片标示
},{versionKey:false});

model.schema = model.mongoose.model('image',_Schema);

module.exports = model; 