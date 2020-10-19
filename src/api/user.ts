import request from '../services/request'

/**
 * 获取會員數據
 * @param {*} params 
 */
function getUserProfile(params = {}) {
    return request.get(`/v1/account/info`, params)
}

export default {
    getUserProfile
}