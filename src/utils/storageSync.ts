import Taro from '@tarojs/taro'

const TokenKey = '_token'
const BindKey = '_isBind'
/**
 * 获取Token
 */
export function getToken() {
    return Taro.getStorageSync(TokenKey)
}

/**
 * 保存Token
 */
export function setToken(token) {
    return Taro.setStorageSync(TokenKey, token)
}

/**
 * 移除Token
 */
export function removeToken() {
    return Taro.removeStorageSync(TokenKey)
}

/**
 * 获取是否登录
 */
export function getBind() {
    return Taro.getStorageSync(BindKey)
}

/**
 * 登录
 */
export function setBind(isBind) {
    return Taro.setStorageSync(BindKey, isBind)
}

/**
 * 登出
 */
export function removeBind() {
    return Taro.removeStorageSync(BindKey)
}