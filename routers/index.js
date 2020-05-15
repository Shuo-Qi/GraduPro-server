const Router = require('koa-router')
const user = require('./user')
const project = require('./project')
const competition = require('./competition')
const freelancer = require('./freelancer')
const employer = require('./employer')

let router = new Router()

router.use('/api/user', user.routes(), user.allowedMethods())
router.use('/api/project', project.routes(), project.allowedMethods())
router.use('/api/competition', competition.routes(), competition.allowedMethods())
router.use('/api/freelancer', freelancer.routes(), freelancer.allowedMethods())
router.use('/api/employer', employer.routes(), employer.allowedMethods())

module.exports = router