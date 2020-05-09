const Router = require('koa-router')
const freelancer = require('../controller/Freelancer');
const loginCheck = require('../middleware/loginCheck')
const router = new Router()

router.get('/getfreelancer', freelancer.getfreelancer);
router.get('/getdetail', freelancer.getdetail);
router.post('/updatefreelancer', loginCheck, freelancer.updatefreelancer);
router.post('/updateskills', loginCheck, freelancer.updateskills);
router.post('/updateworkset', loginCheck, freelancer.updateworkset);
router.post('/updateworks', loginCheck, freelancer.updateworks);
router.post('/updateeducation', loginCheck, freelancer.updateeducation);
router.post('/updatereward', loginCheck, freelancer.updatereward);
router.post('/collect', loginCheck, freelancer.collect);
router.post('/uncollect', loginCheck, freelancer.uncollect);
router.post('/gethourlyproject', loginCheck, freelancer.gethourlyproject);
router.post('/getfixedproject', loginCheck, freelancer.getfixedproject);
router.post('/getcompetition', loginCheck, freelancer.getcompetition);
router.get('/getskills', loginCheck, freelancer.getskills);
router.get('/getcollection', loginCheck, freelancer.getcollection);
router.get('/getworkset', loginCheck, freelancer.getworkset);
router.get('/getworks', loginCheck, freelancer.getworks);
router.get('/geteducation', loginCheck, freelancer.geteducation);
router.get('/getreward', loginCheck, freelancer.getreward);
router.get('/getprojects', loginCheck, freelancer.getprojects);
router.get('/getcompetitions', loginCheck, freelancer.getcompetitions);
module.exports = router;