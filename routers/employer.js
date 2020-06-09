const Router = require('koa-router')
const employer = require('../controller/Employer');
const loginCheck = require('../middleware/loginCheck')
const router = new Router()

router.get('/getemployer', employer.getemployer);
router.get('/getdetail', employer.getdetail);
router.post('/updateemployer', loginCheck, employer.updateemployer);
router.post('/offerproject', loginCheck, employer.offerproject);
router.post('/offercompetition', loginCheck, employer.offercompetition);
router.get('/gettopprojects', loginCheck, employer.gettopprojects);
router.get('/gettopcompetitions', loginCheck, employer.gettopcompetitions);
router.get('/getprojectinfo', loginCheck, employer.getprojectinfo);
router.get('/getcompetitioninfo', loginCheck, employer.getcompetitioninfo);
router.get('/getcompetition', loginCheck, employer.getcompetition);
router.get('/getproject', loginCheck, employer.getproject);
module.exports = router;