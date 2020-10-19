import Taro from '@tarojs/taro'

// 获取当前页url
const getCurrentPageUrl = () => {
    // eslint-disable-next-line no-undef
    let pages = Taro.getCurrentPages()
    let currentPage = pages[pages.length - 1]
    let url = '/' + currentPage.route
    return url
}

// 格式化时间
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 数字补0
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

export default {
    getCurrentPageUrl,
    formatTime
}