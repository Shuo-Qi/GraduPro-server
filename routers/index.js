const Router = require('koa-router')
const hello = require('./hello')
const home = require('./home')
const user = require('./user')
const project = require('./project')
const competition = require('./competition')
const freelancer = require('./freelancer')

let router = new Router()
router.use('/hello', hello.routes(), hello.allowedMethods())
router.use('/home', home.routes(), home.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())
router.use('/project', project.routes(), project.allowedMethods())
router.use('/competition', competition.routes(), competition.allowedMethods())
router.use('/freelancer', freelancer.routes(), freelancer.allowedMethods())

module.exports = router