import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text, Navigator } from '@tarojs/components'
import { AtIcon, AtTabs, AtTabsPane, AtFab } from 'taro-ui';
import Item from './components/item'
import idleApi from '../../api/idle'

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
  state = {
    current: 0,
    tabList: [{ id: 0, title: '全部' }],
    list: [],
    loading: false
  }

  componentWillMount() {
    this.setState({
      tabList: [{ id: 0, title: '全部' }],
      current: 0
    })
    idleApi.getIdleCategory().then(res => {
      if (res.code == 0) {
        this.setState({
          tabList: this.state.tabList.concat(res.data)
        })
      }
    })
  }

  componentDidShow() {
    this.handleGetIdleList(0)
  }

  handleGetIdleList(cId) {
    this.setState({
      loading: false
    })
    idleApi.getIdleList({ cId: cId }).then(res => {
      if (res.code == 0) {
        this.setState({
          list: res.data,
          loading: true
        })
      }
    })
  }

  handleClick(value) {
    this.handleGetIdleList(this.state.tabList[value]['id'])
    this.setState({
      current: value
    })
  }

  onAdd() {
    Taro.navigateTo({
      url: "/packageIdle/pages/application/index"
    })
  }

  toDetail(id) {
    Taro.navigateTo({
      url: "/packageIdle/pages/detail/index?id=" + id
    })
  }

  render = () => {
    const { tabList, list, loading } = this.state

    return (
      <View className='container'>
        <View className='search'>
          <Navigator className='input' url='/packageSearch/pages/idle/index'>
            <AtIcon className='icon' size='18' color='#666' value='search' />
            <Text className='txt'>商品搜索, 共238件闲置商品</Text>
          </Navigator>
        </View>
        <AtTabs scroll current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          {
            tabList.map((_, i) => {
              return (
                <AtTabsPane key={i} current={this.state.current} index={i} className='tab-content'>
                  {
                    list.map((item, index) => {
                      return (
                        <View key={index} onClick={this.toDetail.bind(this, item['id'])}>
                          <Item item={item} />
                        </View>
                      )
                    })
                  }
                  {loading && list.length == 0 && <View style='text-align: center'>无记录</View>}
                </AtTabsPane>
              )
            })
          }
        </AtTabs>
        <View className='add'>
          <AtFab onClick={this.onAdd.bind(this)}>
            <Text className='at-fab__icon at-icon at-icon-add'></Text>
          </AtFab>
        </View>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

