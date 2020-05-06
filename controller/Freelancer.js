const { exec } = require('../db/mysql')
const xss = require('xss')
const { ErrorModel, SuccessModel } = require('../model/resModel')


const getFreelancer = async (name, order) => {
    let sql = `select * from freelancer where 1=1 `
    // 搜索关键字匹配name
    if (name) {
      sql += `and name like '%${name}%' `
    }
    // 排序
    if (order) {
      sql += `order by '${order}' desc;`
  }

    // 返回 promise
    return await exec(sql)
}
 
const getDetail = async (name) => {
    const sql = `select * from freelancer where name='${name}'`
    const rows = await exec(sql)
    return rows[0]
}

const updateFreelancer = async (name, projectData = {}) => {
    const competeRemain = xss(projectData.competeRemain)
    const competeTime = xss(projectData.competeTime)
    let sql = `
        update freelancer set 
    `
    if(competeRemain) {
      sql += `competeRemain='${competeRemain}',`
    }
    if(competeTime) {
      sql += `competeTime='${competeTime}',`
    }
    // 删除最后的“,”
    sql = sql.substr(0, sql.length - 1)
    sql += ` where name='${name}';`
    
    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

    
class Freelancer {

  // 获取freelancer列表
  async getfreelancer(ctx) {
    const query = ctx.query
    let name = query.name || ''
    const order = query.order || ''
    const result = await getFreelancer(name, order)
    ctx.body = new SuccessModel(result)
  }

  // 获取freelancer详情
  async getdetail(ctx) {
    const result = await getDetail(ctx.query.name)
    ctx.body = new SuccessModel(result)
  }

  // 本人更新freelancer
  async updatefreelancer(ctx) {
    const name = ctx.session.username // 本人更新
    // const name = ctx.query.name // 他人更新
    const val = await updateFreelancer(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('更新freelancer失败')
    }
  }

}

module.exports = new Freelancer();