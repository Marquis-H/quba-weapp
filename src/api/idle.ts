import request from '../services/request'

/**
 * 获取类别
 * @param {*} params 
 */
function getIdleCategory(params = {}) {
    return request.get(`/idle/category`, params)
}

/**
 * 获取列表
 * @param {*} params 
 */
function getIdleList(params = {}) {
    return request.get(`/idle/list`, params)
}

/**
 * 获取详情
 * @param {*} params 
 */
function getIdleDetail(params = {}) {
    return request.get(`/idle/detail`, params)
}

/**
 * 创建
 * @param {*} params 
 */
function create(params = {}) {
    return request.post('/idle/create', params, 'application/json')
}

/**
 * 加入订单
 * @param params 
 */
function addTrade(params = {}) {
    return request.post('/idle/add_trade', params, 'application/json')
}

/**
 * 订单详情
 * @param params 
 */
function trade(params = {}) {
    return request.get('/idle/trade', params)
}

/**
 * 修改订单
 * @param params 
 */
function changeTrade(params = {}) {
    return request.post('/idle/change_trade', params, 'application/json')
}

/**
 * 修改二手交易
 * @param params 
 */
function changeIdleApplication(params = {}) {
    return request.post('/idle/change_idle_application', params, 'application/json')
}

/**
 * 搜索
 * @param params 
 */
function search(params = {}) {
    return request.get('/idle/search', params)

}

export default {
    getIdleCategory,
    getIdleList,
    create,
    getIdleDetail,
    addTrade,
    trade,
    changeTrade,
    changeIdleApplication,
    search
}