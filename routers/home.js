const Router = require('koa-router')
const homeController = require('../controller/Home');

let home = new Router()
home.get('/welcome', homeController.welcome);
home.post('/go', homeController.go);

module.exports = home;