//连接数据库
const md5 = require('md5');
const mongoose = require('mongoose');
const MongoInstance = new mongoose.Mongoose();
MongoInstance.Promise = global.Promise;
/**
 * 连接成功
 */
MongoInstance.connection.on('connected', () => {
    console.info('Mongoose connected to ' + mongoUrl);
});
/**
 * 连接异常
 */
MongoInstance.connection.on('error', function (err) {
    console.error('Mongoose connection error: ', err);
});
/**
 * 连接断开
 */
MongoInstance.connection.on('disconnected', function () {
    console.error('Mongoose connection disconnected');
});

class MongoHelper {

    constructor() {
        this.mongoConnections = {};
    }

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
        console.log('mongoUrl:', mongoUrl);
        return mongoUrl
    }

    static closeConnection(cfg) {
        const mongoUrl = this.getUrlFromConfig(cfg);
        const key = md5(mongoUrl);
        if (this.mongoConnections[key]) {
            this.mongoConnections[key].close();
        }
    }

    static getDbConnection(cfg) {
        const mongoUrl = this.getUrlFromConfig(cfg);
        const key = md5(mongoUrl);
        if (this.mongoConnections[key]) {
            return this.mongoConnections[key];
        }
        //创建数据库对象
        const mg = MongoInstance.createConnection(mongoUrl, {useMongoClient: true});
        this.mongoConnections[key] = mg;
        return mg;
    };
}

module.exports = MongoHelper;
