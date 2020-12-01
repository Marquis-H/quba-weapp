import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Image, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import topicApi from '../../../api/topic'
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

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(() => ({}), () => ({}))
class Index extends Component {
  state = {
    hotTopic: {
      avatar: "",
      title: "",
      content: "",
      comment: [],
      views: 0
    },
    current: 0
  }

  componentDidMount() {
    this.getHotTopic()
  }

  // 获取热门话题
  getHotTopic() {
    topicApi.getHotTopic().then(res => {
      if (res.code == 0) {
        this.setState({
          hotTopic: res.data
        })
      }

    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  handleToDetail = () => {
    Taro.navigateTo({
      url: '/packageTopic/pages/comment/index'
    })
  }

  render() {
    const { hotTopic } = this.state
    const tabList = [{ title: '所有' }, { title: '树洞' }, { title: '失物\\证\\卡' }, { title: '吐槽' }]

    return (
      <View className='container'>
        <View className='hot-topic' onClick={this.handleToDetail}>
          <View className='at-row top'>
            <View className='at-col at-col-1 at-col--auto'>
              <Image mode='aspectFill' className='img' src={hotTopic.avatar || images.logo} />
            </View>
            <View className='at-col info'>
              <View className='at-row'>
                <View className='at-col at-col-12' style='padding:5px 0'>
                  <View className='title'>
                    {hotTopic.title}
                  </View>
                  <View className='desp'>
                    {hotTopic.content}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className='at-row'>
            <View className='at-col at-col-1 at-col--auto'>
              <View className='view'><AtIcon value='user' size='15' color='#F00'></AtIcon> Ta也在看</View>
            </View>
            <View className='at-col comment-view'>
              <Image mode='aspectFill' className='comment-img' src={hotTopic.avatar} />
              <Image mode='aspectFill' className='comment-img' src={hotTopic.avatar} />
              <Image mode='aspectFill' className='comment-img' src={hotTopic.avatar} />
              <Image mode='aspectFill' className='comment-img' src={hotTopic.avatar} />
              <Text style='margin-left: 10px ;font-size: 12px;vertical-align: super;'>
                {hotTopic.views}人 <AtIcon value='chevron-right' size='15' color='#b3b3b3'></AtIcon>
              </Text>
            </View>
          </View>
        </View>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >未开放，敬请留意</View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>未开放，敬请留意</View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>未开放，敬请留意</View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={3}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>未开放，敬请留意</View>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

