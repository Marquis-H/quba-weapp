import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Image, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtTag, AtSwipeAction } from 'taro-ui'
import Item from "../../../packageLove/pages/list/components/item";
import loveApi from '../../../api/love'

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
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {

}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user }) => ({ user }), () => ({}))
class Index extends Component {
  state = {
    current: 0,
    loves: [],
    lovesLoading: false
  }

  componentWillMount() {
    loveApi.getLoveList({ id: this.props.user['profile']['pid'] }).then(res => {
      if (res.code == 0) {
        this.setState({
          loves: res.data,
          lovesLoading: true
        })
      }
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  render() {
    const tabList = [{ title: '二手闲置' }, { title: '表白墙' }]
    const options = [
      {
        text: '删除',
        style: {
          backgroundColor: '#FF4949'
        }
      }
    ]
    const { lovesLoading } = this.state

    return (
      <View className='container publish'>
        <AtTabs swipeable={false} current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} className='tab-content'>
            <AtSwipeAction options={options}>
              <View className='post'>
                <View className='post-body'>
                  <View className='content'>
                    <View className='at-row'>
                      <View className='at-col at-col-1 at-col--auto'>
                        <Image mode='aspectFill' className='img' src='http://yanxuan.nosdn.127.net/65091eebc48899298171c2eb6696fe27.jpg' />
                      </View>
                      <View className='at-col info'>
                        <View className='title'>
                          出售笔记本电脑
                            </View>
                        <View className='desp'>
                          有意购买者：xxxx
                      </View>
                        <View>
                          <AtTag
                            size='small'
                            type='primary'
                            circle
                            active
                          >进行中</AtTag>
                        </View>
                        <View style='color: #f7454e'>
                          <Text style='font-size: 18px;'>¥</Text>30 <Text style='font-size: 12px;color: #b3b3b3;text-decoration: line-through'>¥40</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </AtSwipeAction>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1} className='tab-content'>
            {
              this.state.loves.map((item, index) => {
                return (
                  <Item
                    index={index}
                    key={index}
                    item={item}
                    onHandleOpen={() => { }}
                    onHandleLike={() => { }}
                    onHandleComment={() => { }}
                  />
                )
              })
            }
            {lovesLoading && this.state.loves.length == 0 && <View style='text-align:center'>无记录</View>}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

