const { exec } = require('../db/mysql')
const xss = require('xss')
const { ErrorModel, SuccessModel } = require('../model/resModel')


const getProject = async (employer, keyword, order) => {
    let sql = `select * from project where 1=1 `
    // 查某个雇主的项目
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

const getProjectPast = async (employer) => {
    const sql = `select * from project where employer='${employer}' and status<>0`
    return await exec(sql)
}
 
const getDetail = async (id) => {
    const sql = `select * from project where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}

const newProject = async (Title, Description, Employer, Deadline, RewardType, Budget) => {
    const title = Title
    const description = Description
    const employer = Employer
    const deadline = Deadline
    const rewardType = RewardType
    const budget = Budget // 预算 nnn--nnns

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
        insert into project (title, description, employer, createTime, deadline, rewardType, budget, succFreelancer)
        values ('${title}', '${description}', '${employer}', '${timeFormat}', '${deadline}', '${rewardType}', '${budget}', '-');
    `

    const insertData = await exec(sql)
    return insertData
}

const updateProject = async (title, projectData = {}, employer) => {
    // const title = xss(projectData.title)
    const description = xss(projectData.description)
    const skills = xss(projectData.skills)
    // 获取 项目id
    const sqlId = `select id from project where title='${title}';`
    const res = await exec(sqlId)
    // 删除所有skills
    const resDel = await exec(`delete from project_skills where id='${res[0].id}';`)
    // 插入 project_skills 表
    let sql = `insert into project_skills (id,skill) values `
    if (skills.includes('HTML')) {
      sql += `('${res[0].id}','HTML'),`
    }
    if (skills.includes('CSS')) {
      sql += `('${res[0].id}','CSS'),`
    }
    if (skills.includes('网页设计')) {
      sql += `('${res[0].id}','网页设计'),`
    }
    if (skills.includes('Vue')) {
      sql += `('${res[0].id}','Vue'),`
    }
    if (skills.includes('NodeJS')) {
      sql += `('${res[0].id}','NodeJS'),`
    }
    if (skills.includes('Java')) {
      sql += `('${res[0].id}','Java'),`
    }
    if (skills.includes('C++')) {
      sql += `('${res[0].id}','C++'),`
    }
    if (skills.includes('JavaScript')) {
      sql += `('${res[0].id}','JavaScript'),`
    }
    if (skills.includes('TypeScript')) {
      sql += `('${res[0].id}','TypeScript'),`
    }

    // 删除最后的“,”
    sql = sql.substr(0, sql.length - 1)
    const updateSkills = await exec(sql)

    const sql2 = `
        update project set description='${description}' where title='${title}' and employer='${employer}';
    `

    const updateData = await exec(sql2)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const delProject = async (id, employer) => {
    const sql = `delete from project where id='${id}' and employer='${employer}';`
    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return true
    }
    return false
}

const getSkills = async (id) => {
    sql = `select skill from project_skills where id='${id}'`
    const res = await exec(sql)

    // 转换为数组形式
    let skills = []
    for (let i=0;i<res.length;i++) {
        skills.push(res[i].skill)
    }
    
    return skills
}

const getTags = async (id) => {
  sql = `select tag from project_tags where id='${id}'`
  const res = await exec(sql)

  // 转换为数组形式
  let tags = []
  for (let i=0;i<res.length;i++) {
      tags.push(res[i].tag)
  }
  
  return tags
}

const getBid = async (title, freelancer) => {
  sql = `select * from project_freelancer where projectTitle='${title}'`

  if (freelancer) {
    sql += `and freelancerName='${freelancer}';`
  }
  return await exec(sql)
}

const Level = async (title, tags) => {
    // 获取 id
    const sqlId = `select id from project where title='${title}';`
    const res = await exec(sqlId)
    // 插入project_tags表
    if (tags.includes('招聘专家')) {
      exec(`insert into project_tags (id,tag) values ('${res[0].id}', '招聘专家')`)
    }
    if (tags.includes('加封')) {
      exec(`insert into project_tags (id,tag) values ('${res[0].id}', '加封')`)
    }
    if (tags.includes('加精')) {
      exec(`insert into project_tags (id,tag) values ('${res[0].id}', '加精')`)
    }
    if (tags.includes('延长')) {
      exec(`insert into project_tags (id,tag) values ('${res[0].id}', '延长')`)
    }
    if (tags.includes('全职')) {
      exec(`insert into project_tags (id,tag) values ('${res[0].id}', '全职')`)
    }
    if (tags.includes('加密')) {
      exec(`insert into project_tags (id,tag) values ('${res[0].id}', '加密')`)
    }
    if (tags.includes('保密协议')) {
      exec(`insert into project_tags (id,tag) values ('${res[0].id}', '保密协议')`)
    }
    if (tags.includes('IP协议')) {
      exec(`insert into project_tags (id,tag) values ('${res[0].id}', 'IP协议')`)
    }

}
    
class Project {

  // 获取project列表
  async getproject(ctx) {
    const query = ctx.query
    let employer = query.employer || ''
    const keyword = query.keyword || ''
    const order = query.order || ''

    const result = await getProject(employer, keyword, order)
    
    ctx.body = new SuccessModel(result)
  }

  // 获取project详情
  async getdetail(ctx) {
    const result = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 发布project
  async newproject(ctx) {
    // const body = ctx.request.body // ctx.request.body为前端发送的数据
    const { title, description, deadline, rewardType, budget, skills, tags} = ctx.request.body // ctx.request.body为前端发送的数据

    // 插入project表
    const result = await newProject(title, description, ctx.session.username, deadline, rewardType, budget)

    // 插入project_skills表
    if (skills.includes('HTML')) {
      exec(`insert into project_skills (id,skill) values ('${result.insertId}', 'HTML')`)
    }
    if (skills.includes('CSS')) {
      exec(`insert into project_skills (id,skill) values ('${result.insertId}', 'CSS')`)
    }
    if (skills.includes('网页设计')) {
      exec(`insert into project_skills (id,skill) values ('${result.insertId}', '网页设计')`)
    }
    if (skills.includes('Vue')) {
      exec(`insert into project_skills (id,skill) values ('${result.insertId}', 'Vue')`)
    }
    if (skills.includes('NodeJS')) {
      exec(`insert into project_skills (id,skill) values ('${result.insertId}', 'NodeJS')`)
    }
    if (skills.includes('Java')) {
      exec(`insert into project_skills (id,skill) values ('${result.insertId}', 'Java')`)
    }
    if (skills.includes('C++')) {
      exec(`insert into project_skills (id,skill) values ('${result.insertId}', 'C++')`)
    }
    if (skills.includes('JavaScript')) {
      exec(`insert into project_skills (id,skill) values ('${result.insertId}', 'JavaScript')`)
    }
    if (skills.includes('TypeScript')) {
      exec(`insert into project_skills (id,skill) values ('${result.insertId}', 'TypeScript')`)
    }

    // 插入project_tags表
    if (tags.includes('招聘专家')) {
      exec(`insert into project_tags (id,tag) values ('${result.insertId}', '招聘专家')`)
    }
    if (tags.includes('加急')) {
      exec(`insert into project_tags (id,tag) values ('${result.insertId}', '加急')`)
    }
    if (tags.includes('加精')) {
      exec(`insert into project_tags (id,tag) values ('${result.insertId}', '加精')`)
    }
    if (tags.includes('加密')) {
      exec(`insert into project_tags (id,tag) values ('${result.insertId}', '加密')`)
    }
    if (tags.includes('保密协议')) {
      exec(`insert into project_tags (id,tag) values ('${result.insertId}', '保密协议')`)
    }

    ctx.body = new SuccessModel(result)
  }

  // 更新project的skills和description（必须有skills和description两个参数，title在请求url中写）
  async updateproject(ctx) {
    const employer = ctx.session.username
    const val = await updateProject(ctx.query.title, ctx.request.body,employer)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('更新project失败')
    }
  }

  // 删除项目
  async delproject(ctx) {
    
    const employer = ctx.session.username
    const val = await delProject(ctx.query.id, employer)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('删除project失败')
    }
  }

  // 查看项目skills
  async getskills(ctx) {
    const result = await getSkills(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看项目tags
  async gettags(ctx) {
    const result = await getTags(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看employer过去的项目（status=1或2或3）
  async getprojectpast(ctx) {
    const result = await getProjectPast(ctx.session.username)
    ctx.body = new SuccessModel(result)
  }

  // 查看项目竞标
  async getbid(ctx) {
    const title = ctx.query.title || ''
    const freelancer = ctx.query.freelancer || ''
    const result = await getBid(title, freelancer)
    ctx.body = new SuccessModel(result)
  }

  // 升级
  async level(ctx) {
    const val = await Level(ctx.query.title, ctx.request.body.tags)
    ctx.body = new SuccessModel()
    
  }
}

module.exports = new Project();