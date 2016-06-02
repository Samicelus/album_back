var BaseModel = require('../libs/baseModel.js');
var model = new BaseModel();

var _Schema = new model.Schema({
	albumName: String				//专辑名
},{versionKey:false});

model.schema = model.mongoose.model('album',_Schema);

module.exports = model; 
