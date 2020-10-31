import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui';
import * as images from '../../../static/images/index';
import webApi from '../../api/web'

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

type PageState = {
  banners: Array<any>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(() => ({}), () => ({}))
class Index extends Component {
  state = {
    banners: []
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() {
    webApi.getBanners({ slug: 'main-banner' }).then(res => {
      if (res.code == 0) {
        this.setState({
          banners: res.data
        })
      }
    })
  }

  componentDidHide() { }

  toIdle() {
    Taro.switchTab({
      url: "/pages/idle/index"
    })
  }

  toTeam() {
    Taro.switchTab({
      url: "/pages/team/index"
    })
  }

  toLove() {
    Taro.navigateTo({
      url: "/packageLove/pages/list/index"
    })
  }

  render() {
    const { banners } = this.state

    return (
      <View className='container'>
        <View className='address'>
          <AtIcon className='icon' size='18' color='#fff' value='map-pin' />
          <Text className='txt'>北京理工大学珠海学院</Text>
        </View>
        <View className='app-banner'>
          <Swiper className='banner' indicatorDots autoplay interval={3000} duration={100}>
            {
              banners.map(item => {
                return <SwiperItem key={item['title']}>
                  <View className='banner-item'>
                    <Image
                      className='img'
                      src={item['file']}
                    />
                  </View>
                </SwiperItem>
              })
            }
          </Swiper>
        </View>
        <View className='pkg-bg' onClick={this.toIdle}>
          <View className='image'>
            <Image src={images.idleBanner} className='pkg-img' mode='widthFix'>
            </Image>
          </View>
          <View className='pkg-info'>
            <Text className='foot-text'>已上架 999 個商品</Text>
          </View>
        </View>
        <View className='pkg-bg' onClick={this.toTeam}>
          <View className='image'>
            <Image src={images.teamBanner} className='pkg-img' mode='widthFix'>
            </Image>
          </View>
          <View className='team-pkg-info'>
            <Text className='foot-text'>20 个赛事，120个队伍</Text>
          </View>
        </View>
        <View className='pkg-bg' onClick={this.toLove}>
          <View className='image'>
            <Image src={images.loveBanner} className='pkg-img' mode='widthFix'>
            </Image>
          </View>
        </View>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

