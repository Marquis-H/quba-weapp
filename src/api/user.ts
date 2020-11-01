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

export default {
    getUserProfile,
    updateProfile,
    getLovePublishList,
    getIdlePublishList,
    getTradeList
}