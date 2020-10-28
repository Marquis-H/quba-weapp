import Taro from '@tarojs/taro'
import { HTTP_STATUS } from '../const/status'
import { BaseUrl } from './config'
import error from '../utils/error'
import { getToken, setToken } from '../utils/storageSync'
import login from '../utils/login'

function request(params, method = 'GET') {
    let { url, data } = params
    let contentType = 'application/x-www-form-urlencoded'
    contentType = params.contentType || contentType
    var header = { 'content-type': contentType }
    // Token Check
    var token = igoreUrl(url)
    // 判断Token
    if (token) {
        header['Api-Key'] = `${token}`
    }
    return new Promise<any>((resolve, reject) => {
        Taro.showLoading({
            title: '正在加載'
        })
        Taro.request({
            url: BaseUrl + url,
            data: data,
            method: method as any,
            header: header,
            success(res) {
                switch (res.statusCode) {
                    case HTTP_STATUS.NOT_FOUND:
                        error.logError('api', '請求資源不存在')
                    case HTTP_STATUS.BAD_GATEWAY:
                        error.logError('api', '服务端出现了问题')
                    case HTTP_STATUS.FORBIDDEN:
                        error.logError('api', '没有权限访问')
                    case HTTP_STATUS.AUTHENTICATE:
                        error.logError('api', '未綁定')
                        reLogin().then(() => {
                            request(params, method).then(newData => {
                                resolve(newData)
                            }) // 再次情况
                        })
                        break;
                    case HTTP_STATUS.SUCCESS:
                        // 无profile 提示新增
                        if (res.data.code == 400401) {
                            Taro.showModal({
                                title: "完善個人資料",
                                content:
                                    "为了获得更好体验\n请完善个人资料",
                                confirmText: "去填写",
                                showCancel: false
                            }).then(() => {
                                Taro.navigateTo({ url: "/packageMe/pages/profile/edit/index" });
                            });
                            reject('error')
                        }
                        resolve(res.data)
                }
            },
            fail(e) {
                error.logError('api', '请求接口出现问题', e.errMsg)
                reject('error')
            },
            complete() {
                Taro.hideLoading()
            }
        })
    })
}

// 重新登錄
function reLogin() {
    // 登錄
    return new Promise((resolve, reject) => {
        login().then(data => {
            setToken(data.token)
            // 刷新當前頁面
            resolve(true)
        }).catch(e => {
            error.logError('api', '请求接口出现问题', e)
            reject(false)
        })
    })
}

// 一些URL忽略token影響
function igoreUrl(url) {
    const igoreUrlData = [
        '/v1/security/openid',
        '/v1/security/check',
        '/v1/security/bind',
        '/v1/web/banner'
    ]
    if (igoreUrlData.indexOf(url) == -1) { // 忽略token
        return getToken()
    }
}

export default {
    get(url, data = {}) {
        let option = { url, data }

        return request(option)
    },
    post: (url, data, contentType) => {
        let params = { url, data, contentType }

        return request(params, 'POST')
    }
}