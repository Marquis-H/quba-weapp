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

export default {
    getUserProfile,
    updateProfile
}