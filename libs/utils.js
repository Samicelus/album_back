var utils = new Object();

utils.env = (function () {
    return !process.env.NODE_ENV ? 'dev' : process.env.NODE_ENV;
})();

utils.configDir = (function () {
    var path = process.cwd() + '/config.dev';
    if (utils.env == 'production') {
        path = process.cwd() + '/config.production';
    }
    return path;
})();

module.exports = utils;