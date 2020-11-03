import request from '../services/request'

/**
 * 获取列表
 * @param {*} params 
 */
function getTeamList(params = {}) {
    return request.get(`/team/list`, params)
}

/**
 * 创建
 * @param {*} params 
 */
function create(params = {}) {
    return request.post('/team/create', params, 'application/json')
}

/**
 * 队伍详情
 * @param {*} params 
 */
function teamDetail(params = {}) {
    return request.get(`/team/detail`, params)
}

/**
 * 加入队伍
 * @param params 
 */
function addTeam(params = {}) {
    return request.post('/team/add', params, 'application/json')
}

export default {
    getTeamList,
    create,
    teamDetail,
    addTeam
}