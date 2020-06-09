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

const updateFreelancer = async (name, freelancerData = {}) => {
    const competeRemain = xss(freelancerData.competeRemain)
    const competeTime = xss(freelancerData.competeTime)
    const profession = freelancerData.profession
    const description = freelancerData.description
    const reward = freelancerData.reward
    const qualityNum = freelancerData.qualityNum
    const communicationNum = freelancerData.communicationNum
    const professionNum = freelancerData.professionNum
    const againNum = freelancerData.againNum
    let sql = `
        update freelancer set 
    `
    if(competeRemain) {
      sql += `competeRemain='${competeRemain}',`
    }
    if(competeTime) {
      sql += `competeTime='${competeTime}',`
    }
    if(profession) {
      sql += `profession='${profession}',`
    }
    if(description) {
      sql += `description='${description}',`
    }
    if(reward) {
      sql += `reward='${reward}',`
    }
    if(qualityNum) {
      sql += `qualityNum='${qualityNum}',`
    }
    if(communicationNum) {
      sql += `communicationNum='${communicationNum}',`
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

const updateSkills = async (name,skills) => {
    // 获取 用户id
    const sqlId = `select id from user where username='${name}';`
    const res = await exec(sqlId)
    // 删除用户所有skills
    const res0 = await exec(`delete from freelancer_skills where id='${res[0].id}';`)
    // 插入 freelancer_skills 表
    let sql = `insert into freelancer_skills (id,skill) values `
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
    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const updateWorkset = async (name, worksetData = [{},{},{},{}]) => {
    const data1 = worksetData[0]
    const data2 = worksetData[1]
    const data3 = worksetData[2]
    const data4 = worksetData[3]

    // 获取 用户id
    const sqlId = `select id from user where username='${name}';`
    const res = await exec(sqlId)
    // 删除
    const res0 = await exec(`delete from freelancer_workset where id='${res[0].id}';`)
    // 插入freelancer_workset表
    let sql = `insert into freelancer_workset (id,type,title,skills,src) values `
    if (data1) {
      sql += `('${res[0].id}','${data1.type}','${data1.title}','${data1.skills}','${data1.src}'),`
    }
    if (data2) {
      sql += `('${res[0].id}','${data2.type}','${data2.title}','${data2.skills}','${data2.src}'),`
    }
    if (data3) {
      sql += `('${res[0].id}','${data3.type}','${data3.title}','${data3.skills}','${data3.src}'),`
    }
    if (data4) {
      sql += `('${res[0].id}','${data4.type}','${data4.title}','${data4.skills}','${data4.src}'),`
    }

    // 删除最后的“,”
    sql = sql.substr(0, sql.length - 1)
    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }
    return false

}

const updateWorks = async (name, worksData = [{},{},{},{}]) => {
  const data1 = worksData[0]
  const data2 = worksData[1]
  const data3 = worksData[2]
  const data4 = worksData[3]

  // 获取 用户id
  const sqlId = `select id from user where username='${name}';`
  const res = await exec(sqlId)
  // 删除
  const res0 = await exec(`delete from freelancer_works where id='${res[0].id}';`)
  // 插入freelancer_works表
  let sql = `insert into freelancer_works (id,position,company,timeStart,timeEnd,description) values `
  if (data1) {
    sql += `('${res[0].id}','${data1.position}','${data1.company}','${data1.timeStart}','${data1.timeEnd}','${data1.description}'),`
  }
  if (data2) {
    sql += `('${res[0].id}','${data2.position}','${data2.company}','${data2.timeStart}','${data2.timeEnd}','${data2.description}'),`
  }
  if (data3) {
    sql += `('${res[0].id}','${data3.position}','${data3.company}','${data3.timeStart}','${data3.timeEnd}','${data3.description}'),`
  }
  if (data4) {
    sql += `('${res[0].id}','${data4.position}','${data4.company}','${data4.timeStart}','${data4.timeEnd}','${data4.description}'),`
  }

  // 删除最后的“,”
  sql = sql.substr(0, sql.length - 1)
  const updateData = await exec(sql)

  if (updateData.affectedRows > 0) {
      return true
  }
  return false

}

const updateEducation = async (name, educationData = [{},{},{},{}]) => {
  const data1 = educationData[0]
  const data2 = educationData[1]
  const data3 = educationData[2]
  const data4 = educationData[3]

  // 获取 用户id
  const sqlId = `select id from user where username='${name}';`
  const res = await exec(sqlId)
  // 删除
  const res0 = await exec(`delete from freelancer_education where id='${res[0].id}';`)
  // 插入freelancer_education表
  let sql = `insert into freelancer_education (id,degree,college,timeStart,timeEnd) values `
  if (data1) {
    sql += `('${res[0].id}','${data1.degree}','${data1.college}','${data1.timeStart}','${data1.timeEnd}'),`
  }
  if (data2) {
    sql += `('${res[0].id}','${data2.degree}','${data2.college}','${data2.timeStart}','${data2.timeEnd}'),`
  }
  if (data3) {
    sql += `('${res[0].id}','${data3.degree}','${data3.college}','${data3.timeStart}','${data3.timeEnd}'),`
  }
  if (data4) {
    sql += `('${res[0].id}','${data4.degree}','${data4.college}','${data4.timeStart}','${data4.timeEnd}'),`
  }

  // 删除最后的“,”
  sql = sql.substr(0, sql.length - 1)
  const updateData = await exec(sql)

  if (updateData.affectedRows > 0) {
      return true
  }
  return false

}

const updateReward = async (name, rewardData = [{},{},{},{}]) => {
  const data1 = rewardData[0]
  const data2 = rewardData[1]
  const data3 = rewardData[2]
  const data4 = rewardData[3]

  // 获取 用户id
  const sqlId = `select id from user where username='${name}';`
  const res = await exec(sqlId)
  // 删除
  const res0 = await exec(`delete from freelancer_reward where id='${res[0].id}';`)
  // 插入freelancer_reward表
  let sql = `insert into freelancer_reward (id,competition,organization,time,description) values `
  if (data1) {
    sql += `('${res[0].id}','${data1.competition}','${data1.organization}','${data1.time}','${data1.description}'),`
  }
  if (data2) {
    sql += `('${res[0].id}','${data2.competition}','${data2.organization}','${data2.time}','${data2.description}'),`
  }
  if (data3) {
    sql += `('${res[0].id}','${data3.competition}','${data3.organization}','${data3.time}','${data3.description}'),`
  }
  if (data4) {
    sql += `('${res[0].id}','${data4.competition}','${data4.organization}','${data4.time}','${data4.description}'),`
  }

  // 删除最后的“,”
  sql = sql.substr(0, sql.length - 1)
  const updateData = await exec(sql)

  if (updateData.affectedRows > 0) {
      return true
  }
  return false

}

const CollectProject = async (name, collectData = {}) => {
    const item_id = collectData.item_id

    // 获取 用户id
    const sqlId = `select id from user where username='${name}';`
    const res = await exec(sqlId)

    // 获取 item_title
    const sqlItem_title = `select title from project where id='${item_id}';`
    const item_title = await exec(sqlItem_title)

    const sql = `insert into freelancer_collection (id,item_id,item_title,type) values ('${res[0].id}','${item_id}','${item_title[0].title}','project');`
    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const unCollectProject = async (name, uncollectData = {}) => {
  const item_id = uncollectData.item_id

  // 获取 用户id
  const sqlId = `select id from user where username='${name}';`
  const res = await exec(sqlId)

  const sql = `delete from freelancer_collection where id='${res[0].id}' and item_id='${item_id}' and type='project';`
  const updateData = await exec(sql)

  if (updateData.affectedRows > 0) {
      return true
  }
  return false
}

const CollectCompetition = async (name, collectData = {}) => {
  const item_id = collectData.item_id

  // 获取 用户id
  const sqlId = `select id from user where username='${name}';`
  const res = await exec(sqlId)

  // 获取 item_title
  const sqlItem_title = `select title from competition where id='${item_id}';`
  const item_title = await exec(sqlItem_title)

  const sql = `insert into freelancer_collection (id,item_id,item_title,type) values ('${res[0].id}','${item_id}','${item_title[0].title}','competition');`
  const updateData = await exec(sql)

  if (updateData.affectedRows > 0) {
      return true
  }
  return false
}

const unCollectCompetition = async (name, uncollectData = {}) => {
const item_id = uncollectData.item_id

// 获取 用户id
const sqlId = `select id from user where username='${name}';`
const res = await exec(sqlId)

const sql = `delete from freelancer_collection where id='${res[0].id}' and item_id='${item_id}' and type='competition';`
const updateData = await exec(sql)

if (updateData.affectedRows > 0) {
    return true
}
return false
}

const getHourlyProject = async (name, projectData = {}) => {

    const reward = projectData.reward
    const deadline = projectData.deadline
    const hours = projectData.hours
    const note = projectData.note
    const projectId = projectData.projectId
    const top = projectData.top

    // 获取 用户id
    const sqlId = `select id from user where username='${name}';`
    const res1 = await exec(sqlId)

    // 获取 project title,发布者
    const sqlTitle = `select title,employer from project where id='${projectId}';`
    const res2 = await exec(sqlTitle)

    // 获取 当前时间
    const createTime = Date.now()
    // 转换时间格式
    var date = new Date(createTime)
    year = date.getFullYear() + '-'
    month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
    day =  (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate())
    //格式化后的时间
    timeFormat = year + month + day

    // 计算 deposit = 每周薪水*10% + 0.5*小时数（项目费）
    const deposit = (0.1 * reward + 0.5)  * hours

    sql = `insert into project_freelancer
 (freelancerName,freelancerId,projectTitle,projectId,time,employer,reward,deadline,note,deposit,top) values
 ('${name}','${res1[0].id}','${res2[0].title}','${projectId}','${timeFormat}','${res2[0].employer}','${reward}','${deadline}','${note}','${deposit}','${top}');`
    
    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {

        const resNum = await exec(`select bidNum,reward from project where id='${projectId}';`)
        // 增加项目竞标数量
        const bidNum = resNum[0].bidNum + 1;
        // 计算平均报价
        const rewardNum = (resNum[0].reward * (bidNum-1) + reward)/bidNum
        await exec(`update project set bidNum='${bidNum}',reward='${rewardNum}' where id='${projectId}';`)

        return true
    }
    return false
}

const getFixedProject = async (name, projectData = {}) => {

    const reward = projectData.reward
    const deadline = projectData.deadline
    const note = projectData.note
    const projectId = projectData.projectId
    const top = projectData.top
    // 获取 用户id
    const sqlId = `select id from user where username='${name}';`
    const res1 = await exec(sqlId)

    // 获取 project title,发布者
    const sqlTitle = `select title,employer from project where id='${projectId}';`
    const res2 = await exec(sqlTitle)

    // 获取 当前时间
    const createTime = Date.now()
    // 转换时间格式
    var date = new Date(createTime)
    year = date.getFullYear() + '-'
    month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
    day =  (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate())
    //格式化后的时间
    timeFormat = year + month + day

    // 计算 deposit
    const deposit = reward * 0.1

  sql = `insert into project_freelancer
 (freelancerName,freelancerId,projectTitle,projectId,time,employer,reward,deadline,note,deposit,top) values
 ('${name}','${res1[0].id}','${res2[0].title}','${projectId}','${timeFormat}','${res2[0].employer}','${reward}','${deadline}','${note}','${deposit}','${top}');`

    const updateData = await exec(sql)

      if (updateData.affectedRows > 0) {
          const resNum = await exec(`select bidNum,reward from project where id='${projectId}';`)
          // 增加项目竞标数量
          const bidNum = resNum[0].bidNum + 1;
          // 计算平均报价
          const rewardNum = (resNum[0].reward * (bidNum-1) + reward)/bidNum
          await exec(`update project set bidNum='${bidNum}',reward='${rewardNum}' where id='${projectId}';`)

          return true
      }
      return false
}

const getCompetition = async (name, competitionData = {}) => {

  const reward = competitionData.reward
  const note = competitionData.note
  const competitionId = competitionData.competitionId
  const img = competitionData.img
  const licenseName = competitionData.licenseName
  const licenseUrl = competitionData.licenseUrl
  const highlight = competitionData.highlight
  const enseal = competitionData.enseal
  // 获取 用户id
  const sqlId = `select id from user where username='${name}';`
  const res1 = await exec(sqlId)

  // 获取 competition title,发布者
  const sqlTitle = `select title,employer from competition where id='${competitionId}';`
  const res2 = await exec(sqlTitle)

  // 获取 当前时间
  const createTime = Date.now()
  // 转换时间格式
  var date = new Date(createTime)
  year = date.getFullYear() + '-'
  month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
  day =  (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate())
  //格式化后的时间
  timeFormat = year + month + day

sql = `insert into competition_freelancer
(freelancerName,freelancerId,competitionTitle,competitionId,time,employer,reward,note,img,licenseName,licenseUrl,highlight,enseal) values
('${name}','${res1[0].id}','${res2[0].title}','${competitionId}','${timeFormat}','${res2[0].employer}','${reward}','${note}','${img}','${licenseName}','${licenseUrl}','${highlight}','${enseal}');`

  const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
      const resNum = await exec(`select bidNum from competition where id='${competitionId}';`)
      const bidNum = resNum[0].bidNum + 1;
      await exec(`update competition set bidNum='${bidNum}' where id='${competitionId}';`)
        return true
    }
    return false
}

const getSkills = async (id) => {
  sql = `select skill from freelancer_skills where id='${id}'`
  const res = await exec(sql)

  // 转换为数组形式
  let skills = []
  for (let i=0;i<res.length;i++) {
      skills.push(res[i].skill)
  }
  
  return skills
}

const getCollectionProject = async (id) => {
  sql = `select * from project where id in (select item_id from freelancer_collection where id='${id}' and type='project');`
  const res = await exec(sql)
  return res
}

const getCollectionCompetition = async (id) => {
  sql = `select * from competition where id in (select item_id from freelancer_collection where id='${id}' and type='competition');`
  const res = await exec(sql)
  return res
}

const getWorkset = async (id) => {
  sql = `select * from freelancer_workset where id='${id}';`
  const res = await exec(sql)
  return res
}

const getWorks = async (id) => {
  sql = `select * from freelancer_works where id='${id}';`
  const res = await exec(sql)
  return res
}

const getEducation = async (id) => {
  sql = `select * from freelancer_education where id='${id}';`
  const res = await exec(sql)
  return res
}

const getReward = async (id) => {
  sql = `select * from freelancer_reward where id='${id}';`
  const res = await exec(sql)
  return res
}

const getProjects = async (id) => {
  sql = `select * from project_freelancer where freelancerId='${id}';`
  const res = await exec(sql)
  return res
}

const getProjects1 = async (id) => {
  sql = `select * from project_freelancer where freelancerId='${id}' and steps<>2 and steps<>3;`
  const res = await exec(sql)
  return res
}
const getProjects2 = async (id) => {
  sql = `select * from project_freelancer where freelancerId='${id}' and steps=2;`
  const res = await exec(sql)
  return res
}
const getProjects3 = async (id) => {
  sql = `select * from project_freelancer where freelancerId='${id}' and steps=3;`
  const res = await exec(sql)
  return res
}

const getTopProjects = async (id) => {
  sql = `select * from project_freelancer where freelancerId='${id}' limit 4;`
  const res = await exec(sql)
  return res
}

const getTopCompetitions = async (id) => {
  sql = `select * from competition_freelancer where freelancerId='${id}' limit 4;`
  const res = await exec(sql)
  return res
}

const getCompetitions = async (id) => {
  sql = `select * from competition_freelancer where freelancerId='${id}';`
  const res = await exec(sql)
  return res
}

const getCompetitions1 = async (id) => {
  sql = `select * from competition_freelancer where freelancerId='${id}' and steps=1;`
  const res = await exec(sql)
  return res
}
const getCompetitions2 = async (id) => {
  sql = `select * from competition_freelancer where freelancerId='${id}' and steps<>1 and steps<>3;`
  const res = await exec(sql)
  return res
}
const getCompetitions3 = async (id) => {
  sql = `select * from competition_freelancer where freelancerId='${id}' and steps=3;`
  const res = await exec(sql)
  return res
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

  // 获取freelancer详情(query有name属性，结果为name的详情，否则默认取session)
  async getdetail(ctx) {
    // const result = await getDetail(ctx.session.username)
    // const result = await getDetail(ctx.request.body.username)
    let result
    if (ctx.query.name) {
      result = await getDetail(ctx.query.name)
    }
    else {
      result = await getDetail(ctx.session.username)
    }
    
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

  // 本人设置skills
  async updateskills(ctx) {
    const name = ctx.session.username // 本人更新
    const { skills }= ctx.request.body
    const val = await updateSkills(name, skills)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('设置skills失败')
    }
  }

  // 本人设置作品集
  async updateworkset(ctx) {
    const name = ctx.session.username // 本人更新
    const val = await updateWorkset(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('设置作品集失败')
    }
  }

  // 本人设置工作经历
  async updateworks(ctx) {
    const name = ctx.session.username // 本人更新
    const val = await updateWorks(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('设置工作经历失败')
    }
  }

  // 本人设置教育经历
  async updateeducation(ctx) {
    const name = ctx.session.username // 本人更新
    const val = await updateEducation(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('设置教育经历失败')
    }
  }

  // 本人设置获奖经历
  async updatereward(ctx) {
    const name = ctx.session.username // 本人更新
    const val = await updateReward(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('设置获奖经历失败')
    }
  }

  // 收藏项目
  async collectproject(ctx) {
    const name = ctx.session.username // 本人更新
    const val = await CollectProject(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('收藏失败')
    }
  }

  // 取消收藏项目
  async uncollectproject(ctx) {
    const name = ctx.session.username // 本人更新
    const val = await unCollectProject(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('取消收藏失败')
    }
  }

   // 收藏竞赛
   async collectcompetition(ctx) {
    const name = ctx.session.username // 本人更新
    const val = await CollectCompetition(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('收藏失败')
    }
  }

  // 取消收藏竞赛
  async uncollectcompetition(ctx) {
    const name = ctx.session.username // 本人更新
    const val = await unCollectCompetition(name, ctx.request.body)
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('取消收藏失败')
    }
  }

  // 接取 竞标projectd
  // async getproject(ctx) {
  //   const name = ctx.session.username // 本人更新
  //   ctx.request.body.projectId = ctx.query.id
  //   // 获得project的类型
  //   const sql = `select rewardType from project where id='${ctx.request.body.projectId}';`
  //   const res = await exec(sql)

  //   // 0:fiexed 1:hourly
  //   if (res[0].rewardType === 0) {
  //       const val = await getFixedProject(name, ctx.request.body)
  //   }
  //   else {
  //       const val = await getHourlyProject(name, ctx.request.body)
  //   }
    
  //   if (val) {
  //     ctx.body = new SuccessModel()
  //   } else {
  //     ctx.body = new ErrorModel('竞标失败')
  //   }
  // }

  // 接取 时薪项目
  async gethourlyproject(ctx) {
    const name = ctx.session.username // 本人更新
    ctx.request.body.projectId = ctx.query.id // url中输入项目id
    const val = await getHourlyProject(name, ctx.request.body)
    
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('竞标时薪项目失败')
    }
  }

  // 接取 固定价格项目
  async getfixedproject(ctx) {
    const name = ctx.session.username // 本人更新
    ctx.request.body.projectId = ctx.query.id // url中输入项目id
    const val = await getFixedProject(name, ctx.request.body)
    
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('竞标固定价格项目失败')
    }
  }

  // 接取 竞赛competition
  async getcompetition(ctx) {
    const name = ctx.session.username // 本人更新
    ctx.request.body.competitionId = ctx.query.id // url中输入竞赛id
    const val = await getCompetition(name, ctx.request.body)
    
    if (val) {
      ctx.body = new SuccessModel()
    } else {
      ctx.body = new ErrorModel('提交竞赛作品失败')
    }
  }

  // 查看 skills
  async getskills(ctx) {
    let result
    if (ctx.query.id) {
        result = await getSkills(ctx.query.id) // 本人
    }
    else {
        result = await getSkills(ctx.session.id) // 本人
    }
    
    // const result = await getSkills(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看 收藏的项目
  async getcollectionproject(ctx) {
    const result = await getCollectionProject(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  async getcollectioncompetition(ctx) {
    const result = await getCollectionCompetition(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看 作品集
  async getworkset(ctx) {
    let result
    if (ctx.query.id) {
      result = await getWorkset(ctx.query.id)
    }
    else {
      result = await getWorkset(ctx.session.id)
    }
    // const result = await getWorkset(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看 工作经历
  async getworks(ctx) {
    let result
    if (ctx.query.id) {
      result = await getWorks(ctx.query.id)
    }
    else {
      result = await getWorks(ctx.session.id)
    }
    // const result = await getWorks(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看 教育经历
  async geteducation(ctx) {
    let result
    if (ctx.query.id) {
      result = await getEducation(ctx.query.id)
    }
    else {
      result = await getEducation(ctx.session.id)
    }
    // const result = await getEducation(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看 获奖经历
  async getreward(ctx) {
    let result
    if (ctx.query.id) {
      result = await getReward(ctx.query.id)
    }
    else {
      result = await getReward(ctx.session.id)
    }
    // const result = await getReward(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }

  // 查看 竞标的项目
  async getprojects(ctx) {
    const result = await getProjects(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }
  // 正在竞标
  async getprojects1(ctx) {
    const result = await getProjects1(ctx.session.id) // 本人
    ctx.body = new SuccessModel(result)
  }
  // 进行中
  async getprojects2(ctx) {
    const result = await getProjects2(ctx.session.id) // 本人
    ctx.body = new SuccessModel(result)
  }
  // 过去
  async getprojects3(ctx) {
    const result = await getProjects3(ctx.session.id) // 本人
    ctx.body = new SuccessModel(result)
  }

  // 查看最近的项目
  async gettopprojects(ctx) {
    const result = await getTopProjects(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    // console.log(result)
    ctx.body = new SuccessModel(result)
  }

  async gettopcompetitions(ctx) {
    const result = await getTopCompetitions(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    // console.log(result)
    ctx.body = new SuccessModel(result)
  }

  // 查看 竞标的竞赛
  async getcompetitions(ctx) {
    const result = await getCompetitions(ctx.session.id) // 本人
    // const result = await getCollection(ctx.query.id)
    ctx.body = new SuccessModel(result)
  }
  // 进行中
  async getcompetitions1(ctx) {
    const result = await getCompetitions1(ctx.session.id) // 本人
    ctx.body = new SuccessModel(result)
  }
  // 已悬赏
  async getcompetitions2(ctx) {
    const result = await getCompetitions2(ctx.session.id) // 本人
    ctx.body = new SuccessModel(result)
  }
  // 过去
  async getcompetitions3(ctx) {
    const result = await getCompetitions3(ctx.session.id) // 本人
    ctx.body = new SuccessModel(result)
  }

}

module.exports = new Freelancer();