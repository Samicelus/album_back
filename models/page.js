var BaseModel = require('../libs/baseModel.js');
var model = new BaseModel();

var _Schema = new model.Schema({
	pageName: String,			//页面名
	title: String				//标题
},{versionKey:false});

model.schema = model.mongoose.model('page',_Schema);

module.exports = model; 