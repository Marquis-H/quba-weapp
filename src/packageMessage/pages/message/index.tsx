import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from '@tarojs/components';
import { getIdleSearch } from '../../../actions/search'

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
  onGetIdleSearch: (any) => any
}

type PageOwnProps = {
  defaultKeyword: any,
  idleList: any
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ search }) => ({
  defaultKeyword: search.defaultKeyword,
  idleList: search.idles
}), (dispatch) => ({
  onGetIdleSearch(params) {
    dispatch(getIdleSearch(params))
  },
}))
class Index extends Component {
  state = {
  }

  componentWillMount() {

  }

  render() {
    return (
      <ScrollView className='container'>
        <View className='content'>
        </View>
      </ScrollView>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

