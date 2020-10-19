import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui';

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
    banners: [
      {
        "id": 1,
        "name": "合作 谁是你的菜",
        "link": "",
        "url": "http://yanxuan.nosdn.127.net/65091eebc48899298171c2eb6696fe27.jpg",
        "position": 1,
        "content": "合作 谁是你的菜",
        "enabled": true,
        "addTime": "2018-02-01 00:00:00",
        "updateTime": "2018-02-01 00:00:00",
        "deleted": false
      },
      {
        "id": 2,
        "name": "活动 美食节",
        "link": "",
        "url": "http://yanxuan.nosdn.127.net/bff2e49136fcef1fd829f5036e07f116.jpg",
        "position": 1,
        "content": "活动 美食节",
        "enabled": true,
        "addTime": "2018-02-01 00:00:00",
        "updateTime": "2018-02-01 00:00:00",
        "deleted": false
      },
      {
        "id": 3,
        "name": "活动 母亲节",
        "link": "http://www.baidu.com",
        "url": "http://yanxuan.nosdn.127.net/8e50c65fda145e6dd1bf4fb7ee0fcecc.jpg",
        "position": 1,
        "content": "活动 母亲节5",
        "enabled": true,
        "addTime": "2018-02-01 00:00:00",
        "updateTime": "2020-08-19 12:37:40",
        "deleted": false
      }
    ]
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

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
                return <SwiperItem key={item.id}>
                  <View className='banner-item'>
                    <Image
                      className='img'
                      src={item.url}
                    />
                  </View>
                </SwiperItem>
              })
            }
          </Swiper>
        </View>
      </View >
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

