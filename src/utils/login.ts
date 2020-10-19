import Taro from '@tarojs/taro'
import auth from '../api/auth'

export default function login() {
    // 登錄
    return new Promise<any>((resolve, reject) => {
        Taro.login({
            success: res => {
                if (res.code) {
                    // 获取openid
                    auth.login({ code: res.code }).then(r => {
                        if (r.code === 0) {
                            resolve(r.data)
                        } else {
                            reject('未綁定！')
                        }
                    })
                } else {
                    reject('登錄失敗！')
                }
            }
        })
    })
}
