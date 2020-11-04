import request from '../services/request'

/**
 * 收藏列表
 * @param params 
 */
function isMark(params = {}) {
    return request.get(`/mark/is_mark`, params)
}

/**
 * 添加收藏
 * @param {*} params 
 */
function addMark(params = {}) {
    return request.post('/mark/add', params, 'application/json')
}

export default {
    addMark,
    isMark
}

