import request from '../services/request'

/**
 * 获取用户数据
 * @param {*} params 
 */
function getUserProfile(params = {}) {
    return request.get(`/weapp_user/profile`, params)
}

/**
 * 更新用户数据
 * @param {*} params 
 */
function updateProfile(params = {}) {
    return request.post('/weapp_user/profile', params, 'application/json')
}

/**
 * 表白墙发布
 * @param {*} params 
 */
function getLovePublishList(params = {}) {
    return request.get(`/weapp_user/publish/love`, params)
}

/**
 * 二手闲置发布
 * @param {*} params 
 */
function getIdlePublishList(params = {}) {
    return request.get(`/weapp_user/publish/idle_application`, params)
}

/**
 * 交易记录
 * @param {*} params 
 */
function getTradeList(params = {}) {
    return request.get(`/weapp_user/trade/list`, params)
}

/**
 * 组队记录
 * @param params 
 */
function getTeamList(params = {}) {
    return request.get(`/weapp_user/team/list`, params)
}

/**
 * 移除队伍
 * @param params 
 */
function removeTeam(params = {}) {
    return request.post('/weapp_user/team/remove', params, 'application/json')
}

/**
 * mark记录
 * @param params 
 */
function getMarkList(params = {}) {
    return request.get(`/weapp_user/mark/list`, params)
}

/**
 * 移除mark
 * @param params 
 */
function removeMark(params = {}) {
    return request.post('/weapp_user/mark/remove', params, 'application/json')
}

export default {
    getUserProfile,
    updateProfile,
    getLovePublishList,
    getIdlePublishList,
    getTradeList,
    getTeamList,
    removeTeam,
    getMarkList,
    removeMark
}