import request from '../services/request'

/**
 * 获取Banner列表
 * @param {*} params 
 */
function getBanners(params = {}) {
    return request.get(`/web/banner`, params)
}

/**
 * 获取Page列表
 * @param {*} params 
 */
function getPage(params = {}) {
    return request.get(`/web/page`, params)
}

/**
 * 静态数据
 * @param params 
 */
function getStatistic(params = {}) {
    return request.get(`/web/statistic`, params)
}

export default {
    getBanners,
    getPage,
    getStatistic
}