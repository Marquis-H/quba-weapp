import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View } from '@tarojs/components'
import { AtCard, AtTag, AtDivider, AtIcon } from "taro-ui"
import * as images from '../../../../static/images/index';

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

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='container'>
        <AtCard
          note='加入时间：2020-10-10'
          extra='0 人'
          title='全国数学建模大赛'
          thumb={images.leaderIcon}
        >
          <View className='content'>
            <View className='left-side'>
              <View>队员1：xxx，计算机学院-软件工程</View>
              <View>联系方式：手机137xxxxxxxx</View>
              <AtDivider>
                <AtIcon value='check-circle'></AtIcon>
              </AtDivider>
              <View>队员2：xxx，计算机学院-软件工程</View>
              <View>联系方式：手机137xxxxxxxx</View>
            </View>
            <View className='right-side'>
              <AtTag
                size='small'
                type='primary'
                circle
                active
              >进行中</AtTag>
            </View>
          </View>
        </AtCard>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

