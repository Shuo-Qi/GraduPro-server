const {exec} = require('../db/mysql')
const { ErrorModel, SuccessModel } = require('../model/resModel')

const login = async (username, password) => {
    const sql = `
        select id, username from user where username='${username}' and password='${password}'
    `
    const rows = await exec(sql)
    return rows[0] || {}
}
class Login {
 
  // 登陆
  async post(ctx) {
    const { username, password } = ctx.request.body
    const data = await login(username, password)
    if (data.username) {
      // 设置session
      ctx.session.username = data.username
      ctx.session.id = data.id
      // ctx.body = new SuccessModel(ctx.session, '登陆成功')
      ctx.body = new SuccessModel(ctx.session.username)
      return
    }
    ctx.body = new ErrorModel('登陆失败')
}

}
module.exports = new Login();