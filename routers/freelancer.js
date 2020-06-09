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
router.post('/collectproject', loginCheck, freelancer.collectproject);
router.post('/uncollectproject', loginCheck, freelancer.uncollectproject);
router.post('/collectcompetition', loginCheck, freelancer.collectcompetition);
router.post('/uncollectcompetition', loginCheck, freelancer.uncollectcompetition);
router.post('/gethourlyproject', loginCheck, freelancer.gethourlyproject);
router.post('/getfixedproject', loginCheck, freelancer.getfixedproject);
router.post('/getcompetition', loginCheck, freelancer.getcompetition);
router.get('/getskills', loginCheck, freelancer.getskills);
router.get('/getcollectionproject', loginCheck, freelancer.getcollectionproject);
router.get('/getcollectioncompetition', loginCheck, freelancer.getcollectioncompetition);
router.get('/getworkset', loginCheck, freelancer.getworkset);
router.get('/getworks', loginCheck, freelancer.getworks);
router.get('/geteducation', loginCheck, freelancer.geteducation);
router.get('/getreward', loginCheck, freelancer.getreward);
router.get('/getprojects', loginCheck, freelancer.getprojects);
router.get('/getprojects1', loginCheck, freelancer.getprojects1);
router.get('/getprojects2', loginCheck, freelancer.getprojects2);
router.get('/getprojects3', loginCheck, freelancer.getprojects3);
router.get('/gettopprojects', loginCheck, freelancer.gettopprojects);
router.get('/gettopcompetitions', loginCheck, freelancer.gettopcompetitions);
router.get('/getcompetitions', loginCheck, freelancer.getcompetitions);
router.get('/getcompetitions1', loginCheck, freelancer.getcompetitions1);
router.get('/getcompetitions2', loginCheck, freelancer.getcompetitions2);
router.get('/getcompetitions3', loginCheck, freelancer.getcompetitions3);
module.exports = router;