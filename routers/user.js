const Router = require('koa-router')
const user = require('../controller/User');
const loginCheck = require('../middleware/loginCheck')
const router = new Router()

router.post('/login', user.login); // 登陆
router.get('/logout', loginCheck, user.logout); // 注销
router.post('/register', user.register); // 注册
router.post('/updateuser',loginCheck, user.updateuser); // 更新
router.post('/interest', loginCheck, user.interest); // 关注
router.post('/uninterest', loginCheck, user.uninterest); // 取消关注
router.get('/getinterest', loginCheck, user.getinterest); // 关注列表
router.post('/resetpassword', user.resetpassword); // 重置密码
router.get('/getdetail', loginCheck, user.getdetail);
router.get('/getuserinfo', loginCheck, user.getuserinfo);
module.exports = router;