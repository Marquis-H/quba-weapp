import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Image, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtTag, AtSwipeAction, AtMessage } from 'taro-ui'
import Item from "../../../packageLove/pages/list/components/item";
import userApi from '../../../api/user'
import idleApi from '../../../api/idle'
import { Domain } from '../../../services/config'
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
    idleApplications: [],
    lovesLoading: false,
    idleApplicaitonLoading: false
  }

  componentWillMount() {
    userApi.getLovePublishList().then(res => {
      if (res.code == 0) {
        this.setState({
          loves: res.data,
          lovesLoading: true
        })
      }
    })
    this.handleGetIdlePublishList()
  }

  handleGetIdlePublishList() {
    userApi.getIdlePublishList().then(res => {
      if (res.code == 0) {
        this.setState({
          idleApplications: res.data,
          idleApplicaitonLoading: true
        })
      }
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  toDetail(id) {
    Taro.navigateTo({
      url: "/packageIdle/pages/detail/index?id=" + id
    })
  }

  handleSwipeAction(id, status) {
    switch (status) {
      case 'Online':
        status = "Offline";
        break
      case 'Offline':
        status = "Online";
        break
      case 'Doing':
        Taro.atMessage({
          'message': '交易进行中，请等待买家确认交易完成',
          'type': 'warning',
        })
        return;
    }

    idleApi.changeIdleApplication({ id: id, status: status }).then(res => {
      if (res.code == 0) {
        this.handleGetIdlePublishList()
      }
    })
  }

  render() {
    const tabList = [{ title: '二手闲置' }, { title: '表白墙' }]
    const { lovesLoading, idleApplicaitonLoading } = this.state
    const onlineOptions = [
      {
        text: '下架',
        style: {
          backgroundColor: '#FF4949'
        }
      }
    ]
    const offlineOptions = [
      {
        text: '上架',
        style: {
          backgroundColor: '#6190E8'
        }
      }
    ]
    const doingOptions = [
      {
        text: '进行中',
        style: {
          backgroundColor: '#ffb400'
        }
      }
    ]
    return (
      <View className='container publish'>
        <AtTabs swipeable={false} current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} className='tab-content'>
            {
              this.state.idleApplications.map((item, index) => {
                var famous = item['famousPhoto'] ? (Domain + item['famousPhoto']) : images.logo
                return (
                  <AtSwipeAction
                    key={index}
                    onClick={this.handleSwipeAction.bind(this, item['id'], item['status'])}
                    options={item['status'] == 'Online' ? onlineOptions : (item['status'] == 'Offline' ? offlineOptions : doingOptions)}
                  >
                    <View className='post' onClick={this.toDetail.bind(this, item['id'])}>
                      <View className='post-body'>
                        <View className='content'>
                          <View className='at-row'>
                            <View className='at-col at-col-1 at-col--auto'>
                              <Image mode='aspectFill' className='img' src={famous} />
                            </View>
                            <View className='at-col info'>
                              <View className='title'>
                                {item['title']}
                              </View>
                              <View className='desp'>
                                {item['description']}
                              </View>
                              <View>
                                <AtTag
                                  size='small'
                                  type='primary'
                                  circle
                                  active
                                >{item['statusTitle']}</AtTag>
                              </View>
                              <View style='color: #f7454e'>
                                <Text style='font-size: 18px;'>¥</Text>{item['currentCost']} <Text style='font-size: 12px;color: #b3b3b3;text-decoration: line-through'>¥{item['originalCost']}</Text>
                                <Text style='color: #b3b3b3;margin-right:10px;float:right'>x{item['number']}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </AtSwipeAction>
                )
              })
            }
            {idleApplicaitonLoading && this.state.idleApplications.length == 0 && <View style='text-align:center'>无记录</View>}
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
        <AtMessage />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

