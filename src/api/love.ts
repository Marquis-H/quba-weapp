import request from '../services/request'

/**
 * 获取列表
 * @param {*} params 
 */
function getLoveList(params = {}) {
    return request.get(`/love/list`, params)
}

/**
 * 创建
 * @param {*} params 
 */
function create(params = {}) {
    return request.post('/love/create', params, 'application/json')
}

/**
 * like
 * @param {*} params 
 */
function updateLike(params = {}) {
    return request.post('/love/like', params, 'application/json')
}

/**
 * guess
 * @param {*} params 
 */
function updateGuess(params = {}) {
    return request.post('/love/guess', params, 'application/json')
}

export default {
    getLoveList,
    create,
    updateLike,
    updateGuess
}