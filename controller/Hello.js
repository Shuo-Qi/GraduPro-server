class Hello {
  async idg(ctx) {
    ctx.body = {
      status: 1,
      body: 'Home idg'
    }
  }
  async template(ctx) {
    ctx.body = {
      status: 1,
      body: 'Home template'
    }
  }
}

module.exports = new Hello();