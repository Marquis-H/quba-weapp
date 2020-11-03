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

export default {
    getMatchList,
    matchDetail
}