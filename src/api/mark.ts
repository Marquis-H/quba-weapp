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
function addOrRemoveMark(params = {}) {
    return request.post('/mark/add_remove', params, 'application/json')
}

export default {
    addOrRemoveMark,
    isMark
}

