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
 
const getDetail = async (id) => {
    const sql = `select * from project where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}

const newProject = async (projectData = {}) => {
    const title = xss(projectData.title)
    const description = xss(projectData.description)
    const employer = projectData.employer
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
        insert into project (title, description, employer, createTime)
        values ('${title}', '${description}', '${employer}', '${timeFormat}');
    `

    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

const updateProject = async (id, projectData = {}, employer) => {
    const title = xss(projectData.title)
    const description = xss(projectData.description)

    const sql = `
        update project set title='${title}', description='${description}' where id='${id}' and employer='${employer}';
    `

    const updateData = await exec(sql)
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
    
class Project {

  // 获取project列表
  async getproject(ctx) {
    // const method = ctx.method
    const query = ctx.query
    // const id = query.id
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
    const body = ctx.request.body // ctx.request.body为前端发送的数据
    body.employer = ctx.session.username
    const result = await newProject(body)
    ctx.body = new SuccessModel(result)
  }

  // 更新project（必须有title和description两个参数，id在请求url中写）
  async updateproject(ctx) {
    const employer = ctx.session.username
    const val = await updateProject(ctx.query.id, ctx.request.body,employer)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('更新project失败')
    }
  }

  //
  async delproject(ctx) {
    
    const employer = ctx.session.username
    const val = await delProject(ctx.query.id, employer)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('删除project失败')
    }
  }
}

module.exports = new Project();