import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtList, AtListItem } from "taro-ui"
import userApi from '../../../api/user'

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
    sales: [] as any,
    buys: [] as any,
    salesLoading: false,
    buysLoading: false
  }

  componentDidShow() {
    userApi.getTradeList({ slug: 'sale' }).then(res => {
      if (res.code == 0) {
        this.setState({
          sales: res.data,
          salesLoading: true
        })
      }
    })
    userApi.getTradeList({ slug: 'buy' }).then(res => {
      if (res.code == 0) {
        this.setState({
          buys: res.data,
          buysLoading: true
        })
      }
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  toTrade(id, slug) {
    Taro.navigateTo({
      url: "/packageIdle/pages/trade/index?id=" + id + "&slug=" + slug
    })
  }

  render() {
    const tabList = [{ title: '我的购买' }, { title: '我的出售' }]
    const { sales, buys, salesLoading, buysLoading } = this.state
    return (
      <View className='container'>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} className='tab-content'>
            {
              buys.length > 0 && <AtList>
                {
                  buys.map((item, index) => {
                    return (
                      <AtListItem onClick={this.toTrade.bind(this, item.id, 'buy')} key={index} title={item.application.title} className={item.status} extraText={item.statusTitle} arrow='right' />
                    )
                  })
                }
              </AtList>
            }
            {buysLoading && buys.length == 0 && <View style='text-align:center'>无记录</View>}
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1} className='tab-content'>
            {
              sales.length > 0 && <AtList>
                {
                  sales.map((item, index) => {
                    return (
                      <AtListItem onClick={this.toTrade.bind(this, item.id, 'sale')} key={index} title={item.application.title} className={item.status} extraText={item.statusTitle} arrow='right' />
                    )
                  })
                }
              </AtList>
            }
            {salesLoading && sales.length == 0 && <View style='text-align:center'>无记录</View>}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

