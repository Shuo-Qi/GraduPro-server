const Router = require('koa-router')
const project = require('../controller/Project')
const loginCheck = require('../middleware/loginCheck')
const router = new Router();

router.get('/getproject', project.getproject);
router.get('/getdetail', project.getdetail);
router.post('/newproject', loginCheck, project.newproject);
router.post('/updateproject', loginCheck, project.updateproject);
router.post('/delproject', loginCheck, project.delproject);
router.get('/getskills', loginCheck, project.getskills);
router.get('/gettags', loginCheck, project.gettags);

module.exports = router;
