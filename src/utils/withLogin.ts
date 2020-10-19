import Taro from '@tarojs/taro'
import { setToken, getToken, setBind } from '../utils/storageSync'
import login from './login'

const LIFE_CYCLE_MAP = ['willMount', 'didMount', 'didShow'];
//import Taro from '@tarojs/taro'
/**
 *
 * 登录鉴权
 *
 * @param {string} [lifecycle] 需要等待的鉴权完再执行的生命周期 willMount didMount didShow
 * @returns 包装后的Component
 *
 */
function withLogin(lifecycle = 'willMount') {
    // 异常规避提醒
    if (LIFE_CYCLE_MAP.indexOf(lifecycle) < 0) {
        console.warn(
            `传入的生命周期不存在, 鉴权判断异常 ===========> $_{lifecycle}`
        );
        return Component => Component;
    }

    return function withLoginComponent(Component) {

        // 这里还可以通过redux来获取本地用户信息，在用户一次登录之后，其他需要鉴权的页面可以用判断跳过流程
        // @connect(({ user }) => ({
        //   userInfo: user.userInfo,
        // }))
        return class WithLogin extends Component {
            constructor(props) {
                super(props);
            }

            async componentWillMount() {
                if (super.componentWillMount) {
                    if (lifecycle === LIFE_CYCLE_MAP[0]) {
                        const res = await this.$_autoLogin();
                        if (!res) return;
                    }

                    super.componentWillMount();
                }
            }

            async componentDidMount() {
                if (super.componentDidMount) {
                    if (lifecycle === LIFE_CYCLE_MAP[1]) {
                        const res = await this.$_autoLogin();
                        if (!res) return;
                    }

                    super.componentDidMount();
                }
            }

            async componentDidShow() {
                if (super.componentDidShow) {
                    if (lifecycle === LIFE_CYCLE_MAP[2]) {
                        const res = await this.$_autoLogin();
                        if (!res) return;
                    }

                    super.componentDidShow();
                }
            }

            async $_autoLogin() {
                // ...这里是登录逻辑
                return new Promise((resolve, reject) => {
                    Taro.checkSession({
                        success() {
                            if (!getToken()) { // 登录
                                // 登錄
                                login().then(data => {
                                    setToken(data.token)
                                    setBind(data.isValid)
                                    resolve(true)
                                }).catch(e => {
                                    reject(e)
                                })
                            } else {
                                resolve(true)
                            }
                        },
                        fail() { // 無登錄狀態
                            // 清除缓存
                            Taro.clearStorageSync()
                            // 登錄
                            login().then(data => {
                                setToken(data.token)
                                setBind(data.isValid)
                                resolve(true)
                            }).catch(e => {
                                reject(e)
                            })
                        }
                    })
                })
            }
        }
    }
}

export default withLogin;
