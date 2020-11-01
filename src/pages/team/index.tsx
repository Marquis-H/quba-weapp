import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text, Navigator } from '@tarojs/components'
import { AtIcon } from 'taro-ui';

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

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(() => ({}), () => ({}))
class Index extends Component {
  state = {}
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() {
    Taro.showLoading({
      title: '暂未开放',
    })
  }

  componentDidHide() { }

  render() {
    return (
      <View className='container'>
        <View className='search'>
          <Navigator className='input'>
            <AtIcon className='icon' size='18' color='#666' value='search' />
            <Text className='txt'>赛事搜索, 共20个参赛队伍</Text>
          </Navigator>
        </View>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

