const Router = require('koa-router')
const competition = require('../controller/Competition')
const loginCheck = require('../middleware/loginCheck')
const router = new Router();

router.get('/getcompetition', competition.getcompetition);
router.get('/getdetail', competition.getdetail);
router.post('/newcompetition', loginCheck, competition.newcompetition);
router.post('/updatecompetition', loginCheck, competition.updatecompetition);
router.post('/delcompetition', loginCheck, competition.delcompetition);
router.get('/getskills', loginCheck, competition.getskills);
router.get('/gettags', loginCheck, competition.gettags);
router.get('/getcompetitionpast', loginCheck, competition.getcompetitionpast);
module.exports = router;
