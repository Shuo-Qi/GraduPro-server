const Router = require('koa-router')
const employer = require('../controller/Employer');
const loginCheck = require('../middleware/loginCheck')
const router = new Router()

router.get('/getemployer', employer.getemployer);
router.get('/getdetail', employer.getdetail);
router.post('/updateemployer', loginCheck, employer.updateemployer);
router.post('/offerproject', loginCheck, employer.offerproject);
router.post('/offercompetition', loginCheck, employer.offercompetition);

module.exports = router;