import request from '../services/request'

/**
 * 获取学院列表
 * @param {*} params 
 */
function getColleges(params = {}) {
    return request.get(`/common/colleges`, params)
}

export default {
    getColleges
}