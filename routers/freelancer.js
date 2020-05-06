const Router = require('koa-router')
const freelancer = require('../controller/Freelancer');
const loginCheck = require('../middleware/loginCheck')
const router = new Router()

router.get('/getfreelancer', freelancer.getfreelancer);
router.get('/getdetail', freelancer.getdetail);
router.post('/updatefreelancer', loginCheck, freelancer.updatefreelancer);

module.exports = router;