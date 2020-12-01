import request from '../services/request'

/**
 * 获取列表
 * @param {*} params 
 */
function getHotTopic(params = {}) {
    return request.get(`/topic/hot`, params)
}

/**
 * 新增评论
 * @param params 
 */
function addComment(params = {}) {
    return request.post('/topic/add_comment', params, 'application/json')
}

/**
 * 新增查看
 * @param params 
 */
function addView(params = {}) {
    return request.post('/topic/add_view', params, 'application/json')
}

/**
 * 新增LIKE
 * @param params 
 */
function addLike(params = {}) {
    return request.post('/topic/add_like', params, 'application/json')
}

export default {
    getHotTopic,
    addComment,
    addView,
    addLike
}