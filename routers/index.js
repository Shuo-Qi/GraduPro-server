const Router = require('koa-router')
const user = require('./user')
const project = require('./project')
const competition = require('./competition')
const freelancer = require('./freelancer')
const employer = require('./employer')

let router = new Router()

router.use('/user', user.routes(), user.allowedMethods())
router.use('/project', project.routes(), project.allowedMethods())
router.use('/competition', competition.routes(), competition.allowedMethods())
router.use('/freelancer', freelancer.routes(), freelancer.allowedMethods())
router.use('/employer', employer.routes(), employer.allowedMethods())

module.exports = router