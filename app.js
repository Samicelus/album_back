var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var utils = require('./libs/utils.js');
//var compression = require('compression');
//var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
var request = require('superagent');
var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
//var partials = require('express-partials');
//app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/images/favicon.ico'));
//app.use(logger('dev'));
//app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var importer = require('./libs/importer')();
var sysConfig = importer(utils.configDir);

//app.use(session({
//    secret: sysConfig.session.secret,
//    store: new RedisStore({
//        host: sysConfig.redisConfig.jwtServer.host,
//        port: sysConfig.redisConfig.jwtServer.port,
//        ttl: sysConfig.session.maxAge
//    }),
//    cookie: {maxAge: sysConfig.session.maxAge,secure: false},
//    resave: false,
//    saveUninitialized: true
//}));

/*
//鉴权拦截
var jwtHandler = require('./libs/jwtHandler.js');
app.use(function(req, res, next){

    var whiteList = sysConfig.server.whiteList;
    for(var item of whiteList){
       var urlArr = req.path.split('/');
       var itemArr = item.split('/');
       if(urlArr.length==itemArr.length){
           var isMate = true;
           for(var i=0;i<urlArr.length;i++){
               if(itemArr[i]==='*'||urlArr[i]===itemArr[i]){

               }else{
                   isMate= false;
                   break;
               }
           }
           if(isMate){
               return next();
           }
       }
    }
  
    if(utils.env != 'production'){
       console.log(req.url + '  [params]:' + JSON.stringify(req.params)+'[body]:' + JSON.stringify(req.body));
    //    jwtHandler.getJWT('548d97f5e58a3ad4128b4575', function(token){
    //        log(token);
    //    });
    //    jwtHandler.checkJWT(req, function(result){
    //        if(!result){
    //            var err = new Error('No Auth');
    //            err.status = 500;
    //            return next(err);
    //        }
    //        req.body.doctor_id = result;
    //        next();
    //    });
        next();
    }else{
        console.log(req.url + '  [params]:' + JSON.stringify(req.params)+'[body]:' + JSON.stringify(req.body));
        var jwtStr = req.headers['x-json-web-token'] || '';
        request.get(sysConfig.server.passportUrlPrefix + 'users/tokens/check?token=' + jwtStr).end(function(error, result){
           if(error){
               var err = new Error('系统内部错误，请重试。');
               err.status = 500;
               return next(err);
           }
           var userInfo = result.body;
           if(userInfo.errcode == 0 && userInfo.data && userInfo.data.user_id){
               req.body.user = userInfo.data;  //保存到body对象
               return next();
           }
           var err = new Error('系统内部错误，用户信息无效。');
           err.status = 500;
           next(err);
        });
    }
});
*/

//加载路由
var routes = importer('./routes');
for(var key in routes){
    var routeClass = routes[key];
    var routeInstance = new routeClass(app, key);
    routeInstance.initRouter();
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('404 Not Found: ' + req.url);
    err.status = 404;
    next('404 Not Found: ' + req.url);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error.ejs', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error.ejs', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
