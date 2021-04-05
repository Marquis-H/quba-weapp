import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtTag, AtButton, AtMessage, AtList, AtListItem, AtModal } from 'taro-ui'
import teamApi from '../../../api/team'
import * as images from '../../../../static/images'
import { getProfile } from '../../../actions/user'

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
  onGetProfile: () => void
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user }) => ({ user }), (dispatch) => ({
  onGetProfile() {
    dispatch(getProfile())
  },
}))
class Index extends Component {
  state = {
    detail: null as any,
    application: null as any,
    show: false
  }

  componentDidShow() {
    this.handleFetchData()
    this.props.onGetProfile()
  }

  handleFetchData() {
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

  lockTeam = (id) => {
    var { detail } = this.state
    teamApi.lockTeam({ aid: id }).then(res => {
      if (res.code == 0) {
        Taro.atMessage({
          'message': '队伍已锁定',
          'type': 'success',
        })
        detail.isLock = true
        this.setState({
          detail: detail
        })
      }
    })
  }

  onShow = (item) => {
    const { detail } = this.state
    const { user } = this.props
    if (item.isSponsor || user.profile.id == item.profile.pid || user.profile.id == detail.profile.pid) {
      this.setState({
        show: true,
        application: item
      })
    }
  }

  handleConfirm = () => {
    this.setState({
      show: false,
      application: null
    })
  }

  handleRemove = (id) => {
    teamApi.removeTeam({ aid: id }).then(res => {
      if (res.code == 0) {
        if (res.data.isSponsor) {
          Taro.navigateBack()
          Taro.atMessage({
            'message': '队伍解散',
            'type': 'success',
          })
        } else {
          this.setState({
            show: false,
            application: null
          })
          Taro.atMessage({
            'message': '已离开队伍',
            'type': 'success',
          })
          this.handleFetchData()
        }
      }
    })
  }

  render() {
    const { detail, show, application } = this.state
    const { user } = this.props
    const scrollTop = 0
    const Threshold = 20
    var isShowAdd = true
    var isOwner = false
    if (detail && detail.profile.pid == user.profile.id) {
      isShowAdd = false
      isOwner = true
    }
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
                {
                  detail.isLock && <AtTag size='small' type='primary' active customStyle='margin-right:2px'>已锁定</AtTag>
                }
                {detail.matchInfo.title}
              </View>
              <View className='desc'>
                现状：{detail.currentStatus}
              </View>
              <View className='desc'>
                要求：{detail.skill}
              </View>
              {/* <View className='desc'>
                经验要求：{detail.experience}
              </View> */}
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
                onClick={this.onShow.bind(this, detail)}
              />
              {
                detail.children.map((item, index) => {
                  if (item.profile.pid == this.props.user.profile.id) {
                    isShowAdd = false
                  }
                  if (user.profile.id == item.profile.pid || user.profile.id == detail.profile.pid) {
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
                  } else {
                    return (
                      <AtListItem
                        iconInfo={{ size: 30, color: '#6190E8', value: 'user', }}
                        key={index}
                        note='联系方式：保密'
                        title={item.profile.name}
                      />
                    )
                  }
                })
              }
            </AtList>
          </ScrollView>
        }
        {
          detail && isShowAdd && !detail.isLock &&
          <View className='trade'>
            <AtButton type='primary' onClick={this.addTeam.bind(this, detail.id)}>
              加入队伍
            </AtButton>
          </View>
        }
        {
          detail && !isShowAdd && !isOwner && <View className='trade'>
            <AtButton disabled type='primary'>
              已加入队伍
            </AtButton>
          </View>
        }
        {
          detail && isOwner && !detail.isLock &&
          <View className='trade'>
            <AtButton type='primary' onClick={this.lockTeam.bind(this, detail.id)}>
              锁定队伍
            </AtButton>
          </View>
        }
        <AtMessage />
        {
          application && <AtModal
            isOpened={show}
            title={application.profile.name + '的信息'}
            confirmText={
              !detail.isLock && application.profile.pid == user.profile.id && user.profile.id == detail.profile.pid ? '解散' : !detail.isLock && (application.profile.pid == user.profile.id || user.profile.id == detail.profile.pid)
                ? '离开此队伍' : ''}
            cancelText='关闭'
            onClose={this.handleConfirm}
            onCancel={this.handleConfirm}
            onConfirm={this.handleRemove.bind(this, application.id)}
            content={`学院：${application.profile.collegeItem.title}\n\r
            专业：${application.profile.professionalItem.title}\n\r
            拥有技能：${application.skills ? application.skills : '-'}\n\r
            比赛经验：${application.matchExperience ? application.matchExperience : '-'}\n\r
            联系方式：${application.contact ? application.contact : application.profile.mobile}`}
          />
        }
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

