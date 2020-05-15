const { exec } = require('../db/mysql')
const xss = require('xss')
const { ErrorModel, SuccessModel } = require('../model/resModel')


const getCompetition = async (employer, keyword, order) => {
    let sql = `select * from competition where 1=1 `
    // 查某个雇主的竞赛
    if (employer) {
        sql += `and employer='${employer}' `
    }
    // 搜索关键字匹配title
    if (keyword) {
      sql += `and title like '%${keyword}%' `
    }
    // 排序
    if (order) {
      sql += `order by '${order}' desc;`
  }

    // 返回 promise
    return await exec(sql)
}

const getCompetitionPast = async (employer) => {
  const sql = `select * from competition where employer='${employer}' and status<>0`
  return await exec(sql)
}
 
const getDetail = async (id) => {
    const sql = `select * from competition where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}

const newCompetition = async (Title, Description, Employer, Deadline, Budget) => {
    // const title = xss(competitionData.title)
    // const description = xss(competitionData.description)
    // const employer = competitionData.employer
    const title = Title
    const description = Description
    const employer = Employer
    const deadline = Deadline
    const budget = Budget // 预算 nnn
    // 获取时间
    const createTime = Date.now()
    // 转换时间格式
    var date = new Date(createTime)
    year = date.getFullYear() + '-'
    month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
    day =  (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate())
    //格式化后的时间
    timeFormat = year + month + day
    const sql = `
        insert into competition (title, description, employer, createTime, deadline, budget,succFreelancer)
        values ('${title}', '${description}', '${employer}', '${timeFormat}', '${deadline}', '${budget}', '-');
    `

    const insertData = await exec(sql)
    return insertData
}

const updateCompetition = async (id, competitionData = {}, employer) => {
    const title = xss(competitionData.title)
    const description = xss(competitionData.description)

    const sql = `
        update competition set title='${title}', description='${description}' where id='${id}' and employer='${employer}';
    `

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const delCompetition = async (id, employer) => {
    const sql = `delete from competition where id='${id}' and employer='${employer}';`
    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return true
    }
    return false
}


const getSkills = async (id) => {
      sql = `select skill from competition_skills where id='${id}'`
      const res = await exec(sql)

      // 转换为数组形式
      let skills = []
      for (let i=0;i<res.length;i++) {
          skills.push(res[i].skill)
      }
      
      return skills
}

const getTags = async (id) => {
    sql = `select tag from competition_tags where id='${id}'`
    const res = await exec(sql)

    // 转换为数组形式
    let tags = []
    for (let i=0;i<res.length;i++) {
        tags.push(res[i].tag)
    }

    return tags
}
    
class Competition {

  // 获取competition列表
  async getcompetition(ctx) {
    const query = ctx.query
    let employer = query.employer || ''
    const keyword = query.keyword || ''
    const order = query.order || ''
    const result = await getCompetition(employer, keyword, order)
  
    ctx.body = new SuccessModel(result)
  }

  // 获取competition详情
  async getdetail(ctx) {
    const result = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 发布competition
  async newcompetition(ctx) {
    const { title, description, deadline, budget, skills, tags} = ctx.request.body // ctx.request.body为前端发送的数据

    // 插入competition表
    const result = await newCompetition(title, description, ctx.session.username, deadline, budget)

    // 插入competition_skills表
    if (skills.includes('HTML')) {
      exec(`insert into competition_skills (id,skill) values ('${result.insertId}', 'HTML')`)
    }
    if (skills.includes('CSS')) {
      exec(`insert into competition_skills (id,skill) values ('${result.insertId}', 'CSS')`)
    }
    if (skills.includes('网页设计')) {
      exec(`insert into competition_skills (id,skill) values ('${result.insertId}', '网页设计')`)
    }
    if (skills.includes('Vue')) {
      exec(`insert into competition_skills (id,skill) values ('${result.insertId}', 'Vue')`)
    }
    if (skills.includes('NodeJS')) {
      exec(`insert into competition_skills (id,skill) values ('${result.insertId}', 'NodeJS')`)
    }
    if (skills.includes('Java')) {
      exec(`insert into competition_skills (id,skill) values ('${result.insertId}', 'Java')`)
    }
    if (skills.includes('C++')) {
      exec(`insert into competition_skills (id,skill) values ('${result.insertId}', 'C++')`)
    }
    if (skills.includes('JavaScript')) {
      exec(`insert into competition_skills (id,skill) values ('${result.insertId}', 'JavaScript')`)
    }
    if (skills.includes('TypeScript')) {
      exec(`insert into competition_skills (id,skill) values ('${result.insertId}', 'TypeScript')`)
    }

    // 插入competition_tags表
    if (tags.includes('加精')) {
      exec(`insert into competition_tags (id,tag) values ('${result.insertId}', '加精')`)
    }
    if (tags.includes('加急')) {
      exec(`insert into competition_tags (id,tag) values ('${result.insertId}', '加急')`)
    }
    if (tags.includes('加保')) {
      exec(`insert into competition_tags (id,tag) values ('${result.insertId}', '加保')`)
    }
    if (tags.includes('顶级竞赛')) {
      exec(`insert into competition_tags (id,tag) values ('${result.insertId}', '顶级竞赛')`)
    }
    if (tags.includes('高亮')) {
      exec(`insert into competition_tags (id,tag) values ('${result.insertId}', '高亮')`)
    }
    if (tags.includes('加封')) {
      exec(`insert into competition_tags (id,tag) values ('${result.insertId}', '加封')`)
    }
    if (tags.includes('加密')) {
      exec(`insert into competition_tags (id,tag) values ('${result.insertId}', '加密')`)
    }
    if (tags.includes('保密协议')) {
      exec(`insert into competition_tags (id,tag) values ('${result.insertId}', '保密协议')`)
    }

    ctx.body = new SuccessModel(result)
  }

  // 更新competition（必须有title和description两个参数，id在请求url中写）
  async updatecompetition(ctx) {
    const employer = ctx.session.username
    const val = await updateCompetition(ctx.query.id, ctx.request.body,employer)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('更新competition失败')
    }
  }

  //
  async delcompetition(ctx) {
    
    const employer = ctx.session.username
    const val = await delCompetition(ctx.query.id, employer)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('删除competition失败')
    }
  }

  // 查看skills
  async getskills(ctx) {
    const result = await getSkills(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看tags
  async gettags(ctx) {
    const result = await getTags(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看employer过去的竞标（status=1或2或3）
  async getcompetitionpast(ctx) {
    const result = await getCompetitionPast(ctx.session.username)
    ctx.body = new SuccessModel(result)
  }
}

module.exports = new Competition();