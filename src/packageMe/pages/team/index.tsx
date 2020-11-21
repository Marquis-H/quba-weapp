import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View } from '@tarojs/components'
import { AtCard, AtTag, AtDivider, AtIcon } from "taro-ui"
import * as images from '../../../../static/images/index';
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
    list: [] as any,
    loading: false
  }

  componentDidShow() {
    userApi.getTeamList().then(res => {
      if (res.code == 0) {
        this.setState({
          list: res.data,
          loading: true
        })
      }
    })
  }

  toTeam = (id) => {
    Taro.navigateTo({
      url: '/packageTeam/pages/detail/index?id=' + id + '&title=队伍'
    })
  }

  render() {
    const { list, loading } = this.state
    return (
      <View className='container'>
        {
          list.map((item, index) => {
            var totalPeople = item.totalPeople
            var id = item.id
            if (item.parent != null) {
              totalPeople = item.parent.totalPeople
              id = item.parent.id
            }
            return (
              <AtCard
                onClick={this.toTeam.bind(this, id)}
                className='card'
                key={index}
                note={'加入时间：' + item.createdAt}
                extra={totalPeople + ' 人'}
                title={item.matchInfo.title}
                thumb={item.isSponsor ? images.leaderIcon : null}
              >
                <View className='content'>
                  <View className='left-side'>
                    {
                      item.isSponsor && <View>
                        <View>队员1：{item.profile.name}，{item.profile.collegeItem.title}-{item.profile.professionalItem.title}</View>
                        <View>联系方式：{item.profile.mobile}</View>
                      </View>
                    }
                    {
                      item.isSponsor && item.children.map((value, i) => {
                        return (
                          <View key={i}>
                            <AtDivider>
                              <AtIcon value='check-circle'></AtIcon>
                            </AtDivider>
                            <View>队员{i + 2}：{value.profile.name}，{value.profile.collegeItem.title}-{value.profile.professionalItem.title}</View>
                            <View>联系方式：{value.contact}</View>
                          </View>
                        )
                      })
                    }
                    {
                      !item.isSponsor && <View>
                        <View>队员1：{item.parent.profile.name}，{item.parent.profile.collegeItem.title}-{item.parent.profile.professionalItem.title}</View>
                        <View>联系方式：{item.parent.profile.mobile}</View>
                      </View>
                    }
                    {
                      !item.isSponsor && item.parent.children.map((value, i) => {
                        return (
                          <View key={i}>
                            <AtDivider>
                              <AtIcon value='check-circle'></AtIcon>
                            </AtDivider>
                            <View>队员{i + 2}：{value.profile.name}，{value.profile.collegeItem.title}-{value.profile.professionalItem.title}</View>
                            <View>联系方式：{value.contact}</View>
                          </View>
                        )
                      })
                    }
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
            )
          })
        }
        {
          loading && list.length == 0 && <View style='text-align:center'>无记录</View>
        }
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

