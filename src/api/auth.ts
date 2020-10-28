import request from '../services/request'

/**
 * 获取openid
 * @param {*} params 
 */
function getOpenId(params = {}) {
    return request.post(`/security/openid`, params, 'application/json')
}

/**
 * 綁定用戶
 * @param {*} params 
 */
function bindAccount(params = {}) {
    return request.post('/security/bind', params, 'application/json')
}

/**
 * 检查openid
 * @param {*} params 
 */
function checkOpenId(params = {}) {
    return request.post('/security/check', params, 'application/json')
}

/**
 * 发送验证码
 * @param {*} params 
 */
function getCaptcha(params = {}) {
    return request.post('/security/captcha', params, 'application/json')
}

export default {
    getOpenId,
    bindAccount,
    checkOpenId,
    getCaptcha
}