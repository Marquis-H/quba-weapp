import Taro from '@tarojs/taro'
import utils from '../utils'

function logError(name, action, info = '') {
    var device = ""
    if (!info) {
        info = 'empty'
    }
    try {
        var deviceInfo = Taro.getSystemInfoSync()
        device = JSON.stringify(deviceInfo)
    } catch (err) {
        console.error('not support getSystemInfoSync api', err.message)
    }
    let time = utils.formatTime(new Date())
    console.error(time, name, action, info, device)
    if (typeof info === 'object') {
        info = JSON.stringify(info)
        console.error(info)
    }
}

export default {
    logError
}