const {exec} = require('../db/mysql')
const { ErrorModel, SuccessModel } = require('../model/resModel')

const login = async (username, password) => {
    const sql = `
        select id, username from user where username='${username}' and password='${password}'
    `
    const updateStatus = `
        update user set status=0 where username='${username}' and password='${password}'
    `
    const rows = await exec(sql)
    exec(updateStatus)
    return rows[0] || {}
}

class User {
 
    // 登陆
    async login(ctx) {
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

    // 退出登录
    async logout(ctx) {
      const username = ctx.session.username
      const id = ctx.session.id
      const updateStatus = `
        update user set status=1 where id=${id}
    `
      if (username && id) {
        ctx.session = null
        exec(updateStatus)
        ctx.body = new SuccessModel('注销成功')
        return
      }
      ctx.body = new ErrorModel('注销失败')
    }

    // 注册
    async register(ctx) {
      const { username, password, telephone, role } = ctx.request.body
      // 注册，插入user表
      const insertUser = `
          insert into user (username, password, role, status, telephone) values ('${username}', '${password}', '${role}', '1', '${telephone}');
      `

      if(username && password) {
          const data = await exec(insertUser)
          // 插入相应的free/emp表
          const insertFreelancer = `
              insert into freelancer (id, name) values ('${data.insertId}','${username}');
          `
          const insertEmployer = `
              insert into employer (id, name) values ('${data.insertId}', '${username}');
          `

          if(role === 1) {
              const insertData = await exec(insertFreelancer)
              if (insertData.affectedRows > 0) {
                  ctx.body = new SuccessModel('freelancer注册成功')
                  return
              }
              ctx.body = new ErrorModel('freelancer注册失败')
          }
          else {
              const insertData = await exec(insertEmployer)
              if (insertData.affectedRows > 0) {
                  ctx.body = new SuccessModel('employer注册成功')
                  return
              }
              ctx.body = new ErrorModel('employer注册失败')
          }
      } else {
          ctx.body = new ErrorModel('输入不能为空')
      }
    }

}
module.exports = new User();