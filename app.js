const Koa = require('koa')
const cors = require('@koa/cors');
const path = require('path')
const bodyParser = require('koa-bodyparser')
const router = require('./routers')
const staticFiles = require('koa-static')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const { REDIS_CONF } = require('./config/db')
const app = new Koa()

app.use(cors())

// 指定 public目录为静态资源目录，用来存放 js css images 等
app.use(staticFiles(path.resolve(__dirname, "./public")))

// session配置
app.keys = ['QRWxsx#23423_']
app.use(session(
  { // 配置 cookie
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    // 配置 redis
    store: redisStore({
      // all: '127.0.0.1:6379'  // 写死本地的 redis
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
    })
  }
))
app.use(bodyParser())
  
// routes
app.use(router.routes()).use(router.allowedMethods())


app.listen(3000, () => {
  console.log('I am listening port 3000')
})