const Router = require('koa-router')
const login = require('../controller/Login');
const router = new Router()

// router.get('/get', login.get);
router.post('/', login.post); // 登陆

// router.get('/session', login.test)

module.exports = router;