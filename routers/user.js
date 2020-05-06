const Router = require('koa-router')
const user = require('../controller/User');
const loginCheck = require('../middleware/loginCheck')
const router = new Router()

router.post('/login', user.login); // 登陆
router.post('/logout', loginCheck, user.logout); // 注销
router.post('/register', user.register); // 注册

module.exports = router;