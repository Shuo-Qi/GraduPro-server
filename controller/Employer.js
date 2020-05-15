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

    if (verify.length != 0) {
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

    if (verify.length != 0) {
        const sql = `update competition set succFreelancer='${name[0].name}',succWork='${verify[0].NO}' where id='${competitionId}' and employer='${employer}';`
        const updateData = await exec(sql)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    }
    return false
}

const getTopProjects = async (name) => {
  sql = `select * from project where employer='${name}' limit 4;`
  const res = await exec(sql)
  return res
}

const getProjectInfo = async (projectId,freelancerName) => {
  const sql = `select * from project_freelancer where freelancerName='${freelancerName}' and projectId='${projectId}'`
  const rows = await exec(sql)
  return rows[0]
}

const getCompetitionInfo = async (competitionId,freelancerName) => {
  const sql = `select * from competition_freelancer where freelancerName='${freelancerName}' and competitionId='${competitionId}'`
  const rows = await exec(sql)
  return rows[0]
}

const getCompetition = async (employer, keyword, order,status,succFreelancer) => {
  let sql = `select * from competition where 1=1 `
  // 查某个雇主的竞赛
  if (employer) {
      sql += `and employer='${employer}' `
  }
  // 搜索关键字匹配title
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  // 状态
  if (status) {
    sql += `and status='${status}' `
  }
  // 是否已悬赏
  if (succFreelancer) {
    // 0对应-，表示没有succFreelancer；1对应有
    if (succFreelancer == 0) {
      sql += `and succFreelancer='-' `
    }
    else {
      sql += `and succFreelancer<>'-' `
    }
  }
  // 排序
  if (order) {
    sql += `order by '${order}' desc;`
}

  // 返回 promise
  return await exec(sql)
}

const getProject = async (employer, keyword, order,status,succFreelancer) => {
  let sql = `select * from project where 1=1 `
  // 查某个雇主的项目
  if (employer) {
      sql += `and employer='${employer}' `
  }
  // 搜索关键字匹配title
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  // 状态
  if (status) {
    sql += `and status='${status}' `
  }
  // 是否已悬赏
  if (succFreelancer) {
    // 0对应-，表示没有succFreelancer；1对应有
    if (succFreelancer == 0) {
      sql += `and succFreelancer='-' `
    }
    else {
      sql += `and succFreelancer<>'-' `
    }
  }
  // 排序
  if (order) {
    sql += `order by '${order}' desc;`
}

  // 返回 promise
  return await exec(sql)
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
    let result
    if (ctx.query.name) {
      result = await getDetail(ctx.query.name)
    }
    else {
      result = await getDetail(ctx.session.username)
    }
    
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

   // 查看最近的项目
   async gettopprojects(ctx) {
    const result = await getTopProjects(ctx.session.username) // 本人
    ctx.body = new SuccessModel(result)
  }

  // 查看已悬赏项目的信息
  async getprojectinfo(ctx) {
    const result = await getProjectInfo(ctx.query.projectId,ctx.query.freelancerName)
    ctx.body = new SuccessModel(result)
  }

  // 查看已悬赏竞赛的信息
  async getcompetitioninfo(ctx) {
    const result = await getCompetitionInfo(ctx.query.competitionId,ctx.query.freelancerName)
    ctx.body = new SuccessModel(result)
  }

  // employer本人获取competition列表
  async getcompetition(ctx) {
    const query = ctx.query
    let employer = query.employer || ''
    const keyword = query.keyword || ''
    const order = query.order || ''
    const status = query.status || ''
    const succFreelancer = query.succFreelancer || ''
    const result = await getCompetition(ctx.session.username, keyword, order,status,succFreelancer)
    ctx.body = new SuccessModel(result)
  }

  // employer本人获取project列表
  async getproject(ctx) {
    const query = ctx.query
    let employer = query.employer || ''
    const keyword = query.keyword || ''
    const order = query.order || ''
    const status = query.status || ''
    const succFreelancer = query.succFreelancer || ''
    const result = await getProject(ctx.session.username, keyword, order,status,succFreelancer)
    ctx.body = new SuccessModel(result)
  }
}


module.exports = new Employer();