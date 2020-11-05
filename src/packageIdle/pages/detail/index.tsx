import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Swiper, SwiperItem, Image, ScrollView, Text } from '@tarojs/components'
import { AtButton, AtTag, AtRate, AtMessage, AtIcon } from 'taro-ui'
import idleApi from '../../../api/idle'
import markApi from '../../../api/mark'
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
    detail: null as any,
    isMark: false
  }

  componentDidMount() {
    var params = (getCurrentInstance() as any).router.params
    idleApi.getIdleDetail({ id: params.id }).then(res => {
      if (res.code == 0) {
        this.setState({
          detail: res.data
        })

        Taro.setNavigationBarTitle({
          title: res.data.title
        })
      }
    })
    markApi.isMark({ id: params.id, slug: 'idle_application' }).then(res => {
      if (res.code == 0) {
        this.setState({
          isMark: !(res.data instanceof Array)
        })
      }
    })
  }

  addTrade = () => {
    const { id } = this.state.detail // application id
    idleApi.addTrade({ id: id }).then(res => {
      if (res.code == 0) {
        Taro.redirectTo({
          url: "/packageIdle/pages/trade/index?id=" + res.data.id
        })
      } else {
        Taro.atMessage({
          'message': res.message,
          'type': 'error'
        })
      }
    })
  }

  mark = (id) => {
    markApi.addMark({ id: id, module: 'idle_application' }).then(res => {
      if (res.code == 0) {
        this.setState({
          isMark: true
        })
      }
    })
  }

  render() {
    const { detail, isMark } = this.state
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
            <Swiper className='main-slider' indicatorDots autoplay interval={3000} duration={100}>
              {
                detail.photos.map(item => {
                  return <SwiperItem key={item['title']}>
                    <View className='banner-item'>
                      <Image
                        mode='aspectFill'
                        className='img'
                        src={Domain + item['file']}
                      />
                    </View>
                  </SwiperItem>
                })
              }
            </Swiper>
            <View className='content'>
              <View className='title'>
                {detail['title']}
              </View>
              <View className='status'>
                <View className='at-row'>
                  <View className='at-col at-col-1 at-col--auto'>
                    <AtTag size='small' type='primary' circle active>正在出售</AtTag>
                  </View>
                  <View className='at-col'>
                    <View style='color: #f7454e;text-align:right'>
                      <Text style='font-size: 18px;'>¥</Text>{detail.currentCost} <Text style='font-size: 12px;color: #b3b3b3;text-decoration: line-through'>¥{detail.originalCost}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className='desc'>
                {detail.description}
              </View>
              <View className='number'>
                <View className='at-row'>
                  <View className='at-col at-col-8' style='display: flex;'>
                    <Text>新旧程度：</Text><AtRate
                      className='oldDeep'
                      value={detail.oldDeep}
                    />
                  </View>
                  <View className='at-col at-col-2'>
                    数量：x{detail.number}
                  </View>
                  <View className='at-col at-col-2' style='text-align:right'>
                    {
                      isMark ? <AtIcon value='heart-2' size='20' color='#ffb400'></AtIcon>
                        : <AtIcon onClick={this.mark.bind(this, detail['id'])} value='heart' size='20' color='#ffb400'></AtIcon>
                    }
                  </View>
                </View>
              </View>
            </View>
            <View className='remark-link'>
              <View className='remark'>
                备注：{detail.remark ? detail.remark : '-'}
              </View>
              <View className='link'>
                商品原始购买链接：{detail.originalUrl ? detail.originalUrl : '-'}
              </View>
            </View>
          </ScrollView>
        }
        {
          detail &&
          <View className='trade'>
            <AtButton type='primary' disabled={detail.status == 'Online' ? false : true} onClick={this.addTrade}>
              {detail.status == 'Online' ? "发起交易" : (detail.status == 'Doing' ? "交易中" : "下架")}
            </AtButton>
          </View>
        }
        <AtMessage />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

