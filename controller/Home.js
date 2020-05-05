class Home {
  // 测试接收get参数
  async welcome(ctx) {
    const query = ctx.query;
    // console.log(ctx.query === ctx.request.query) // true
    // console.log(ctx.querystring === ctx.querystring) // true
    ctx.body = {
      status: 1,
      time: Date.now(),
      body: `Home welcome! get params:${JSON.stringify(query)}`
    }
  }
  // 测试接收post参数
  async go(ctx) {
    /* console.log(ctx.request.body) */
    ctx.body = {
      status: 1,
      body: `Home go! post params:${JSON.stringify(ctx.request.body)}`
    }
  }
}

module.exports = new Home();