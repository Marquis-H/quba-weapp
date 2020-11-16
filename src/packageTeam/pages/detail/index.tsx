import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtButton, AtMessage, AtList, AtListItem, AtModal } from 'taro-ui'
import teamApi from '../../../api/team'
import * as images from '../../../../static/images'

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

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user }) => ({ user }), () => ({}))
class Index extends Component {
  state = {
    detail: null as any,
    application: null as any,
    show: false
  }

  componentDidShow() {
    var params = (getCurrentInstance() as any).router.params
    teamApi.teamDetail({ id: params.id }).then(res => {
      if (res.code == 0) {
        var data = res.data
        Taro.setNavigationBarTitle({
          title: params.title + " " + (data.name ? data.name : "")
        })
        this.setState({
          detail: data
        })
      }
    })
  }

  addTeam = (id) => {
    Taro.navigateTo({
      url: "/packageTeam/pages/join/index?id=" + id
    })
  }

  onShow = (item) => {
    this.setState({
      show: true,
      application: item
    })
  }

  handleConfirm = () => {
    this.setState({
      show: false,
      application: null
    })
  }

  render() {
    const { detail, show, application } = this.state
    const scrollTop = 0
    const Threshold = 20
    var isShowAdd = true
    return (
      <View className='container'>
        {
          detail &&
          <ScrollView
            className='scroll-view'
            scrollY
            scrollWithAnimation
            scrollTop={scrollTop}
            lowerThreshold={Threshold}
            upperThreshold={Threshold}
          >
            <View className='content'>
              <View className='title'>
                {detail.matchInfo.title}
              </View>
              <View className='desc'>
                现状：{detail.currentStatus}
              </View>
              <View className='desc'>
                技能要求：{detail.skill}
              </View>
              <View className='desc'>
                经验要求：{detail.experience}
              </View>
              <View className='number'>
                <Text>人数限制：{detail.people}</Text>
                <Text style='color: #b3b3b3;margin-right:10px;float:right'>加入队伍截止时间：{detail.joinEndAt}</Text>
              </View>
            </View>
            <AtList className='team-list'>
              <AtListItem
                note={'联系方式：' + detail.profile.mobile}
                title={detail.profile.name}
                extraText='发起人'
                thumb={images.leaderIcon}
              />
              {
                detail.children.map((item, index) => {
                  if (item.profile.id == this.props.user.id) {
                    isShowAdd = false
                  }
                  return (
                    <AtListItem
                      iconInfo={{ size: 30, color: '#6190E8', value: 'user', }}
                      onClick={this.onShow.bind(this, item)}
                      key={index}
                      note={'联系方式：' + item.contact}
                      title={item.profile.name}
                      extraText='点击查看'
                    />
                  )
                })
              }
            </AtList>
          </ScrollView>
        }
        {
          detail && isShowAdd &&
          <View className='trade'>
            <AtButton type='primary' onClick={this.addTeam.bind(this, detail.id)}>
              加入队伍
            </AtButton>
          </View>
        }
        <AtMessage />
        {
          application && <AtModal
            isOpened={show}
            title={application.profile.name + '的信息'}
            confirmText='确认'
            onClose={this.handleConfirm}
            onConfirm={this.handleConfirm}
            content={`学院：${application.profile.collegeItem.title}\n\r
            专业：${application.profile.professionalItem.title}\n\r
            拥有技能：${application.skills}\n\r
            比赛经验：${application.matchExperience}\n\r
            联系方式：${application.contact}`}
          />
        }
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

