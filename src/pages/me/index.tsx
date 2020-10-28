import React, { Component, ComponentClass } from 'react'
import Taro from "@tarojs/taro";
import { connect } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'
import { AtAvatar, AtIcon, AtFloatLayout } from "taro-ui";
import { getProfile } from '../../actions/user'
import auth from "../../api/auth";
import withLogin from "../../utils/withLogin";
import { setToken, setBind } from "../../utils/storageSync";

import './index.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  user: any
}

type PageDispatchProps = {
  onGetProfile: () => void
}

type PageOwnProps = {}

type PageState = {
  isOpened: boolean,
  isLogin: boolean,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user }) => ({ user }), (dispatch) => ({
  onGetProfile() {
    dispatch(getProfile())
  },
}))
@withLogin('willMount')
class Index extends Component {
  state = {
    isOpened: false,
    isLogin: false,
  }
  componentWillMount() {
    this.props.onGetProfile()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onHandleRefreshProfile() {
    this.props.onGetProfile()
  }

  goTo = () => {
    if (!this.state.isLogin && !this.props.user.profile.isLogin) {
      this.setState({
        isOpened: true
      });
    } else {
      Taro.navigateTo({
        url: `/packageMe/pages/profile/index?avatarUrl=${this.props.user.profile.avatarUrl}`
      });
    }
  }

  handleLoginByMobile() {
    Taro.navigateTo({
      url: "/packageMe/pages/bind/index"
    });
  }

  handleLogin(e) {
    // 確認授權
    if (e.detail.errMsg == "getUserInfo:ok") {
      var userInfo = e.detail.userInfo;
      var that = this
      this.setState({
        // avatarUrl: userInfo.avatarUrl,
        // username: userInfo.nickName,
        isOpened: false,
        isLogin: true
      });
      // 登錄
      Taro.login({
        success: res => {
          if (res.code) {
            // 获取openid
            auth.getOpenId({ code: res.code }).then(r => {
              const { openid } = r.data;
              auth
                .bindAccount({
                  openid: openid,
                  nickname: userInfo.nickName,
                  avatar: userInfo.avatarUrl
                })
                .then(re => {
                  setToken(re.data.token);
                  setBind(true);
                  Taro.showModal({
                    title: "完善個人資料",
                    content:
                      "为了获得更好体验\n请完善个人资料",
                    confirmText: "去填写",
                    showCancel: false
                  }).then(() => {
                    Taro.navigateTo({ url: "/packageMe/pages/profile/edit/index" });
                  });
                  // 获取用户信息
                  that.onHandleRefreshProfile()
                })
                .catch(err => {
                  console.log("登录失败！" + err.message);
                });
            });
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
    }
  }

  handleClose() {
    this.setState({
      isOpened: false
    });
  }

  render() {
    const { isOpened } = this.state;
    const { avatar, nickname } = this.props.user.profile;
    return (
      <View className='container'>
        <View>
          <View className='header-bg'></View>
          <View className='userinfo-card'>
            <View className='header'>
              <AtAvatar image={avatar} circle className='my-avatar'></AtAvatar>
              <View className='txt' onClick={this.goTo}>
                {nickname ? nickname : "登录 / 绑定"}
                <View style='font-size: 12px'>北京理工大学珠海学院</View>
              </View>
              <View style='margin-right:12px; margin-left:auto'>
                {nickname && <AtIcon onClick={this.onHandleRefreshProfile.bind(this)} value='reload' size='30' color='#6190E8'></AtIcon>}
              </View>
            </View>
            <View className='footer'>
              <View className='my-btn'>
                <Text className='text'>{710}</Text>
                <Text className='text'>总交易数</Text>
              </View>
              <View className='my-btn'>
                <Text className='text'>{1022}</Text>
                <Text className='text'>总发布商品数</Text>
              </View>
            </View>
          </View>
        </View>
        <AtFloatLayout
          isOpened={isOpened}
          onClose={this.handleClose.bind(this)}
        >
          <Button
            type='primary'
            openType='getUserInfo'
            onGetUserInfo={this.handleLogin.bind(this)}
            className='wechat-btn'
          >
            <Text>微信用戶快速登錄</Text>
          </Button>
          {/* <View
            className='login-m'
            onClick={this.handleLoginByMobile.bind(this)}
          >
            輸入手機號碼登錄/註冊
          </View> */}
        </AtFloatLayout>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

