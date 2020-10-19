import request from '../services/request'

/**
 * 登录
 * @param {*} params 
 */
function login(params = {}) {
    return request.post(`/v1/security/login`, params, 'application/json')
}

export default {
    login
}