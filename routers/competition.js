const Router = require('koa-router')
const competition = require('../controller/Competition')
const loginCheck = require('../middleware/loginCheck')
const router = new Router();

router.get('/getcompetition', competition.getcompetition);
router.get('/getdetail', competition.getdetail);
router.post('/newcompetition', loginCheck, competition.newcompetition);
router.post('/updatecompetition', loginCheck, competition.updatecompetition);
router.post('/delcompetition', loginCheck, competition.delcompetition);

module.exports = router;
