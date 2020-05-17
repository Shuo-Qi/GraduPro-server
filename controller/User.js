const {exec, escape} = require('../db/mysql')
const xss = require('xss')
const { ErrorModel, SuccessModel } = require('../model/resModel')

const login = async (username, password) => {
    username = escape(username)
    password = escape(password)

    const sql = `
        select id, username, role from user where username=${username} and password=${password}
    `
    const updateStatus = `
        update user set status=0 where username=${username} and password=${password}
    `
    const rows = await exec(sql)
    exec(updateStatus)
    return rows[0] || {}
}

const resetPassword = async (telephone, password) => {
  const newpassword = xss(password)
  const sql = `
      update user set password='${newpassword}' where telephone='${telephone}';
  `
  const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const updateUser = async (username, userData = {}) => {
    const password = xss(userData.password)
    const balance = xss(userData.balance)
    const avatar = userData.avatar
    const country = userData.country
    const email = userData.email
    const telephone = userData.telephone
    const star = userData.star
    let sql = `
        update user set 
    `
    if(password) {
      sql += `password='${password}',`
    }
    if(balance) {
      sql += `balance='${balance}',`
    }
    if(avatar) {
      sql += `avatar='${avatar}',`
    }
    if(country) {
      sql += `country='${country}',`
    }
    if(email) {
      sql += `email='${email}',`
    }
    if(telephone) {
        sql += `telephone='${telephone}',`
    }
    if(star) {
        sql += `star='${star}',`
    }
    // 删除最后的“,”
    sql = sql.substr(0, sql.length - 1)
    sql += ` where username='${username}';`

    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const Interest = async (followId, followedId) => {
    const sql = `insert into user_interest (follow_id, followed_id) values ('${followId}','${followedId}');`
    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const unInterest = async (followId, followedId) => {
  const sql = `delete from user_interest where follow_id='${followId}' and followed_id='${followedId}';`
  const updateData = await exec(sql)

  if (updateData.affectedRows > 0) {
      return true
  }
  return false
}

const getInterest = async (id) => {
    const sql = `select * from user where id in (select followed_id from user_interest where follow_id='${id}');`
    const res = await exec(sql)
    return res
}

// 用户信息
const getDetail = async (name) => {
  const sql = `select * from user where username='${name}'`
  const rows = await exec(sql)
  return rows[0]
}

const getUserInfo = async (id) => {
  const sql = `select * from user where id='${id}'`
  const rows = await exec(sql)
  return rows[0]
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
          ctx.body = new SuccessModel(data) // 返回角色，用于选择页面跳转
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

          if(role == 1) {
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

    // 本人更新用户信息
    async updateuser(ctx) {
        const name = ctx.session.username // 本人更新
        // const name = ctx.query.username // 他人更新
        const val = await updateUser(name, ctx.request.body)
        if (val) {
          ctx.body = new SuccessModel()
        } else {
          ctx.body = new ErrorModel('更新freelancer失败')
        }
    }

    // 关注
    async interest(ctx) {
      const val = await Interest(ctx.session.id,ctx.request.body.followed_id)
      if (val) {
        ctx.body = new SuccessModel()
      } else {
        ctx.body = new ErrorModel('关注失败')
      }
    }

    // 取消关注
    async uninterest(ctx) {
      const val = await unInterest(ctx.session.id,ctx.request.body.followed_id)
      if (val) {
        ctx.body = new SuccessModel()
      } else {
        ctx.body = new ErrorModel('取消关注失败')
      }
    }

    // 查看 关注的人的信息
    async getinterest(ctx) {
      const result = await getInterest(ctx.session.id)
      ctx.body = new SuccessModel(result)
    }

    // 忘记密码
    async resetpassword(ctx) {
      const telephone = ctx.request.body.telephone
      const password = ctx.request.body.password
      const val = await resetPassword(telephone, password)
      if (val) {
        ctx.body = new SuccessModel()
      } else {
        ctx.body = new ErrorModel('重置密码失败')
      }
    }

    // 获取user详情(query有name属性，结果为name的详情，否则默认取session)
    async getdetail(ctx) {
      let result
      if(ctx.query.name) {
        result = await getDetail(ctx.query.name)
      }
      else {
        result = await getDetail(ctx.session.username)
      }

      // console.log(ctx.session.username)
      // console.log(result)
      ctx.body = new SuccessModel(result)
    }

    // 获取他人信息
    async getuserinfo(ctx) {
      const result = await getUserInfo(ctx.query.id)
      // console.log(ctx.session.username)
      // console.log(result)
      ctx.body = new SuccessModel(result)
    }

}
module.exports = new User();