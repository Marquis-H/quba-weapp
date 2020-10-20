import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtIcon } from "taro-ui";
import * as images from '../../images/index';

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

type PageStateProps = {}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {
  avatar: String,
  nickname: String | null
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(() => ({}), () => ({}))
class Index extends Component {
  state = {
    // eslint-disable-next-line import/no-commonjs
    avatar: images.avatar,
    nickname: null
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onHandleRefreshProfile() { }

  goTo() { }

  render() {
    const { avatar, nickname } = this.state;
    return (
      <View className='container'>
        <View>
          <View className='header-bg'></View>
          <View className='userinfo-card'>
            <View className='header'>
              <AtAvatar image={avatar} circle className='my-avatar'></AtAvatar>
              <View className='txt' onClick={this.goTo}>
                {nickname ? nickname : "登录 / 注册"}
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
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

