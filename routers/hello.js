const Router = require('koa-router')
const hello = require('../controller/Hello')

const router = new Router();

// POST /hello
router.post('/', hello.idg);

// get /hello/template
router.get('/template', hello.template);

module.exports = router;
