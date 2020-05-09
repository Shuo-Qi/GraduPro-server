const { exec } = require('../db/mysql')
const xss = require('xss')
const { ErrorModel, SuccessModel } = require('../model/resModel')


const getEmployer = async (name, order) => {
    let sql = `select * from employer where 1=1 `
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
    const sql = `select * from employer where name='${name}'`
    const rows = await exec(sql)
    return rows[0]
}

const updateEmployer = async (name, freelancerData = {}) => {
    const profession = freelancerData.profession
    const description = freelancerData.description
    const qualityNum = freelancerData.qualityNum
    const communicaitonNum = freelancerData.communicaitonNum
    const professionNum = freelancerData.professionNum
    const againNum = freelancerData.againNum
    let sql = `
        update employer set 
    `

    if(profession) {
      sql += `profession='${profession}',`
    }
    if(description) {
      sql += `description='${description}',`
    }
    if(qualityNum) {
      sql += `qualityNum='${qualityNum}',`
    }
    if(communicaitonNum) {
      sql += `communicaitonNum='${communicaitonNum}',`
    }
    if(professionNum) {
      sql += `professionNum='${professionNum}',`
    }
    if(againNum) {
      sql += `againNum='${againNum}',`
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

const offerProject = async (projectId, freelancerId, employer) => {
    // 获取 succFreelancer的姓名
    const sqlFreelancer = `select name from freelancer where id='${freelancerId}';`
    const name = await exec(sqlFreelancer)

    // 验证是否此人竞标了此项目
    const verify = await exec(`select * from project_freelancer where projectId='${projectId}' and freelancerId='${freelancerId}';`)

    if (verify.length !== 0) {
        const sql = `update project set succFreelancer='${name[0].name}' where id='${projectId}' and employer='${employer}';`
        const updateData = await exec(sql)

        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    }
    return false
    
}

const offerCompetition = async (competitionId, freelancerId, employer) => {
    // 获取 succFreelancer的姓名
    const sqlFreelancer = `select name from freelancer where id='${freelancerId}';`
    const name = await exec(sqlFreelancer)

    // 验证是否此人竞标了此项目
    const verify = await exec(`select * from competition_freelancer where competitionId='${competitionId}' and freelancerId='${freelancerId}';`)

    if (verify.length !== 0) {
        const sql = `update competition set succFreelancer='${name[0].name}' where id='${competitionId}' and employer='${employer}';`
        const updateData = await exec(sql)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    }
    return false
}

    
class Employer {

  // 获取employer列表
  async getemployer(ctx) {
    const query = ctx.query
    let name = query.name || ''
    const order = query.order || ''
    const result = await getEmployer(name, order)
    ctx.body = new SuccessModel(result)
  }

  // 获取employer详情
  async getdetail(ctx) {
    const result = await getDetail(ctx.query.name)
    ctx.body = new SuccessModel(result)
  }

  // 本人更新employer
  async updateemployer(ctx) {
    const name = ctx.session.username // 本人更新
    // const name = ctx.query.name // 他人更新
    const val = await updateEmployer(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('更新employer失败')
    }
  }

  // 悬赏 project
  async offerproject(ctx) {
    const name = ctx.session.username // 本人
    const val = await offerProject(ctx.query.id,ctx.request.body.freelancerId,name)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('project悬赏失败')
    }
  }

  // 悬赏 competition
  async offercompetition(ctx) {
    const name = ctx.session.username // 本人
    const val = await offerCompetition(ctx.query.id,ctx.request.body.freelancerId,name)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('competition悬赏失败')
    }
  }
}

module.exports = new Employer();