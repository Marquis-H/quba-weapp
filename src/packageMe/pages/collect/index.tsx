import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Image, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtSwipeAction, AtTag } from 'taro-ui'
import userApi from '../../../api/user'
import { Domain } from '../../../services/config'

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
    idleApplications: [] as any,
    matchInfos: [] as any,
    loadIdleApplication: false,
    loadMatchInfos: false
  }

  componentDidShow() {
    userApi.getMarkList({ slug: 'idle_application' }).then(res => {
      if (res.code == 0) {
        this.setState({
          idleApplications: res.data,
          loadIdleApplication: true
        })
      }
    })

    userApi.getMarkList({ slug: 'match_info' }).then(res => {
      if (res.code == 0) {
        this.setState({
          matchInfos: res.data,
          loadMatchInfos: true
        })
      }
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  toIdleApplicationDetail = (id, slug) => {
    if (slug == 'idle_application') {
      Taro.navigateTo({
        url: "/packageIdle/pages/detail/index?id=" + id
      })
    }
  }

  handleRemove = (id, slug) => {
    var { idleApplications, matchInfos } = this.state
    userApi.removeMark({ id: id }).then(res => {
      if (res.code == 0) {
        if (slug == 'idle_application') {
          var index = idleApplications.findIndex(item => { return item.id == id })
          this.setState({
            idleApplications: idleApplications.splice(index, index)
          })
        } else if (slug == 'match_info') {
          var index = matchInfos.findIndex(item => { return item.id == id })
          this.setState({
            matchInfos: matchInfos.splice(index, index)
          })
        }
      }
    })
  }

  render() {
    const { idleApplications, matchInfos, loadIdleApplication, loadMatchInfos } = this.state
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
            {
              idleApplications.map((item, index) => {
                const idleApplication = item.idleApplication
                return (
                  <AtSwipeAction key={index} autoClose onClick={this.handleRemove.bind(this, item.id, 'idle_application')} options={options} className='swipe'>
                    <View onClick={this.toIdleApplicationDetail.bind(this, idleApplication.id, 'idle_application')} className='content idle'>
                      <View className='at-row'>
                        <View className='at-col at-col-1 at-col--auto'>
                          <Image mode='aspectFill' className='img' src={Domain + idleApplication.famousPhoto} />
                        </View>
                        <View className='at-col info'>
                          <View className='content'>
                            <View className='left-side'>
                              <View>
                                {idleApplication.title}
                              </View>
                              <View style='color: #f7454e'>
                                <Text style='font-size: 18px;'>¥</Text>{idleApplication.currentCost} <Text style='font-size: 12px;color: #b3b3b3;text-decoration: line-through'>¥{idleApplication.originalCost}</Text>
                              </View>
                            </View>
                            <View className='right-side'>
                              <AtTag
                                size='small'
                                type='primary'
                                circle
                                active
                              >{idleApplication.statusTitle}</AtTag>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </AtSwipeAction>
                )
              })
            }
            {loadIdleApplication && idleApplications.length == 0 && <View style='text-align:center'>无记录</View>}
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1} className='tab-content'>
            {
              matchInfos.map((item, index) => {
                const matchInfo = item.matchInfo
                return (
                  <AtSwipeAction key={index} autoClose onClick={this.handleRemove.bind(this, item.id, 'match_info')} options={options} className='swipe'>
                    <View className='content team'>
                      <View className='left-side'>
                        <View>
                          {matchInfo.title}
                        </View>
                        <View>
                          队伍：{matchInfo.sponsorApplications} 个
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
                )
              })
            }
            {loadMatchInfos && matchInfos.length == 0 && <View style='text-align:center'>无记录</View>}
          </AtTabsPane>
        </AtTabs>
      </View >
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

