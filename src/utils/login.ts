import Taro from '@tarojs/taro'
import auth from '../api/auth'
import { setBind } from '../utils/storageSync'

export default function login() {
    // 登錄
    return new Promise<any>((resolve, reject) => {
        Taro.login({
            success: res => {
                if (res.code) {
                    // 获取openid
                    auth.getOpenId({ code: res.code }).then(r => {
                        const { openid } = r.data
                        auth.checkOpenId({ openid: openid }).then(e => {
                            if (e.code === 0) {
                                resolve(e.data.token)
                            } else {
                                setBind(false) // 未绑定
                                reject('未綁定！')
                            }
                        })
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                    reject('登錄失敗！')
                }
            }
        })
    })
}
