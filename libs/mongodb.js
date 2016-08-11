var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);
var util = require('./utils.js');

var connec;
var mongoConfig = require(util.configDir + '/mongodb.json').dataServer;
if(mongoConfig.user){
	var url = 'mongodb://' + mongoConfig.user + ':' + mongoConfig.pwd + '@' + mongoConfig.host + ':' + mongoConfig.port + '/' + mongoConfig.db + '?authMechanism=MONGODB-CR';
	console.log('trying to connect: '+url);
	var opts = {
    auth: {
        authMechanism: 'MONGODB-CR'
    	}
	};
	connec = mongoose.createConnection(url,opts);
	}else{
		mongoose.connect('mongodb://' + mongoConfig.host + ':' + mongoConfig.port + '/' + mongoConfig.db);
		}


connec.on('error', console.error.bind(console,'connection error:'));
module.exports = mongoose;




