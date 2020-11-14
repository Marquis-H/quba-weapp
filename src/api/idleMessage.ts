import request from '../services/request'

/**
 * 获取问答列表
 * @param {*} params 
 */
function getIdleMessage(params = {}) {
    return request.get(`/idle_message/list`, params)
}

/**
 * 创建问答
 * @param params 
 */
function createIdleMessage(params = {}) {
    return request.post('/idle_message/create', params, 'application/json')
}

export default {
    getIdleMessage,
    createIdleMessage
}