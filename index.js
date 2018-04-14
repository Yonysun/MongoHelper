//连接数据库
const md5 = require('md5');
// const mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
/**
 * 连接成功
 */
mongoose.connection.on('connected', () => {
    console.info('Mongoose connected...');
});
/**
 * 连接异常
 */
mongoose.connection.on('error', function (err) {
    console.error('Mongoose connection error: ', err);
});
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.error('Mongoose connection disconnected');
});

const mongoConnections = {};

class MongoHelper {

    static getUrlFromConfig(cfg) {
        if (!cfg) {
            throw new Error('invalid config: ' + cfg);
            return null;
        }
        if (!cfg.host) {
            throw new Error('invalid host: ' + cfg.host);
            return null;
        }
        if (!cfg.dbName) {
            throw new Error('invalid dbName: ' + cfg.dbName);
            return null;
        }
        if (isNaN(cfg.port)) {
            cfg.port = 27017;
        }
        let mongoUrl = 'mongodb://';
        if (cfg.username && cfg.password) {
            mongoUrl += cfg.username + ':' + cfg.password + '@';
        }
        mongoUrl += cfg.host + ':' + cfg.port + '/' + cfg.dbName;
        // console.log('getUrlFromConfig: ', cfg.host,cfg.dbName);
        return mongoUrl
    }

    static closeConnection(mongoUrl) {
        // const mongoUrl = this.getUrlFromConfig(cfg);
        const key = md5(mongoUrl);
        if (mongoConnections[key]) {
            mongoConnections[key].close();
        }
    }

    static getDbConnection(mongoUrl) {
        // const mongoUrl = this.getUrlFromConfig(cfg);
        const key = md5(mongoUrl);
        if (mongoConnections[key]) {
            return mongoConnections[key];
        }
        //创建数据库对象
        const mg = mongoose.createConnection(mongoUrl, {useMongoClient: true,autoReconnect:true,poolSize:10});
        mongoConnections[key] = mg;
        return mg;
    };
    static newSchema(){
        return new mongoose.Schema({},{strict:false});
    }
}

MongoHelper.ObjectId = mongoose.Types.ObjectId;

module.exports = MongoHelper;
