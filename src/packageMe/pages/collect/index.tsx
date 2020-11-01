import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Image, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtSwipeAction, AtTag } from 'taro-ui'

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
    current: 0
  }

  componentDidShow() {
    Taro.showLoading({
      title: '暂未开放',
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  handleRemove = () => {

  }

  render() {
    const tabList = [{ title: '二手交易' }, { title: '比赛' }]
    const options = [
      {
        text: '取消',
        style: {
          backgroundColor: '#FF4949'
        }
      }
    ]
    return (
      <View className='collect'>
        <AtTabs swipeable={false} current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} className='tab-content'>
            <AtSwipeAction autoClose onClick={this.handleRemove} options={options}>
              <View className='content idle'>
                <View className='at-row'>
                  <View className='at-col at-col-1 at-col--auto'>
                    <Image mode='aspectFill' className='img' src='http://yanxuan.nosdn.127.net/65091eebc48899298171c2eb6696fe27.jpg' />
                  </View>
                  <View className='at-col info'>
                    <View className='content'>
                      <View className='left-side'>
                        <View>
                          出售手机和笔记本
                        </View>
                        <View style='color: #f7454e'>
                          <Text style='font-size: 18px;'>¥</Text>30 <Text style='font-size: 12px;color: #b3b3b3;text-decoration: line-through'>¥40</Text>
                        </View>
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
                  </View>
                </View>
              </View>
            </AtSwipeAction>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1} className='tab-content'>
            <AtSwipeAction autoClose onClick={this.handleRemove} options={options}>
              <View className='content team'>
                <View className='left-side'>
                  <View>
                    全国数学建模大赛
                    </View>
                  <View>
                    队伍：0 个
                    </View>
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
            </AtSwipeAction>
          </AtTabsPane>
        </AtTabs>
      </View >
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

