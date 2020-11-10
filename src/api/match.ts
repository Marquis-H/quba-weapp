import request from '../services/request'

/**
 * 获取列表
 * @param {*} params 
 */
function getMatchList(params = {}) {
    return request.get(`/match/list`, params)
}

/**
 * 赛事详情
 * @param params 
 */
function matchDetail(params = {}) {
    return request.get(`/match/detail`, params)
}

/**
 * 类别
 * @param params 
 */
function getMatchCategory(params = {}) {
    return request.get(`/match/category`, params)
}

/**
 * 搜索
 * @param params 
 */
function search(params = {}) {
    return request.get(`/match/search`, params)
}

export default {
    getMatchList,
    matchDetail,
    search,
    getMatchCategory
}