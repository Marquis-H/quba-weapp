import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtTag, AtButton, AtMessage, AtList, AtListItem, AtIcon } from 'taro-ui'
import matchApi from '../../../api/match'
import teamApi from '../../../api/team'
import { Domain } from '../../../services/config'
import markApi from '../../../api/mark'

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
    onlineOrOffline: ["线下比赛", "线上比赛"],
    types: ["国家级", "省级", "市级", "校级", "院级"],
    detail: null as any,
    teamList: [] as any,
    isMark: false
  }

  componentDidShow() {
    var params = (getCurrentInstance() as any).router.params
    matchApi.matchDetail({ id: params.id }).then((res) => {
      if (res.code == 0) {
        this.setState({
          detail: res.data
        })

        Taro.setNavigationBarTitle({
          title: res.data.title
        })
      }
    })
    teamApi.getTeamList({ id: params.id }).then((res) => {
      if (res.code == 0) {
        this.setState({
          teamList: res.data
        })
      }
    })
    markApi.isMark({ id: params.id, slug: 'match_info' }).then(res => {
      if (res.code == 0) {
        this.setState({
          isMark: !(res.data instanceof Array)
        })
      }
    })
  }

  addTeam = () => {
    const { id } = this.state.detail // application id
    Taro.navigateTo({
      url: "/packageTeam/pages/application/index?id=" + id
    })
  }

  copyText = (text) => {
    Taro.setClipboardData({
      data: text,
      success: function () {
        Taro.getClipboardData({
          success: function () {
            Taro.atMessage({
              'message': '复制成功，请到浏览器粘贴打开',
              'type': 'error'
            })
          }
        })
      }
    })
  }

  applicationDetail(id, title) {
    Taro.navigateTo({
      url: "/packageTeam/pages/detail/index?id=" + id + "&title=" + title
    })
  }

  mark = (id) => {
    markApi.addOrRemoveMark({ id: id, module: 'match_info' }).then(res => {
      if (res.code == 0) {
        this.setState({
          isMark: !this.state.isMark
        })
      }
    })
  }

  render() {
    const { onlineOrOffline, types, detail, teamList, isMark } = this.state
    const scrollTop = 0
    const Threshold = 20
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
              <View className='at-row'>
                <View className='at-col at-col-10' >
                  <View className='title'>
                    {detail['title']}
                  </View>
                </View>
                <View className='at-col at-col-2' style='text-align:right'>
                  {
                    isMark ? <AtIcon value='heart-2' size='20' color='#ffb400' onClick={this.mark.bind(this, detail['id'])}></AtIcon>
                      : <AtIcon onClick={this.mark.bind(this, detail['id'])} value='heart' size='20' color='#ffb400'></AtIcon>
                  }
                </View>
              </View>
              <View className='status'>
                {
                  detail.matchCategory &&
                  <View>
                    <AtTag size='small' type='primary' circle active>{onlineOrOffline[detail.tabs[0]]}</AtTag>
                    <AtTag size='small' type='primary' circle active customStyle='margin-left:2px'>{types[detail.matchCategory.type]}</AtTag>
                    <AtTag size='small' type='primary' circle active customStyle='margin-left:2px'>{detail.matchCategory.title}</AtTag>
                  </View>
                }
              </View>
              <View className='desc'>
                {detail.qualificationLimit}
              </View>
              <View className='number'>
                <Text>人数限制：{detail.peopleLimit}</Text>
                <Text style='color: #b3b3b3;margin-right:10px;float:right'>结束时间：{detail.endAt}</Text>
              </View>
              <View className='urls'>
                相关链接：{
                  detail && detail.urls.split(',').map((url, index) => {
                    return (
                      <Text style='margin-right: 3px;color:#78A4F4' key={index} onClick={this.copyText.bind(this, url)}>链接{index + 1}</Text>
                    )
                  })
                }
              </View>
              {
                detail.files.length > 0 && <View className='file'>
                  相关文件：<Text style='color:#78A4F4' onClick={this.copyText.bind(this, Domain + detail.files[0]['response']['data']['file'])}>文件</Text>
                </View>
              }
            </View>
            <AtList className='team-list'>
              {
                teamList.map((item, index) => {
                  return (
                    <AtListItem
                      onClick={this.applicationDetail.bind(this, item.id, '队伍' + (index + 1))}
                      key={index}
                      arrow='right'
                      note={'目前队内人数 ' + (item.childrens + 1)}
                      title={'队伍' + (index + 1) + " " + (item.name ? item.name : "")}
                      extraText={item.isLock ? '已锁定' : '加入'}
                    />
                  )
                })
              }
              {teamList.length == 0 && <View style='text-align:center; padding: 10px 0'>无队伍</View>}
            </AtList>
          </ScrollView>
        }
        {
          detail &&
          <View className='trade'>
            <AtButton type='primary' onClick={this.addTeam}>
              发起组队
            </AtButton>
          </View>
        }
        <AtMessage />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

