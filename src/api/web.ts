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

export default {
    getBanners,
    getPage
}