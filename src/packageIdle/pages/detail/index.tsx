import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Swiper, SwiperItem, Image, ScrollView, Text, Button } from '@tarojs/components'
import { AtButton, AtTag, AtMessage, AtIcon, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtTextarea } from 'taro-ui'
import idleApi from '../../../api/idle'
import idleMessageApi from '../../../api/idleMessage'
import markApi from '../../../api/mark'
import { Domain } from '../../../services/config'
import Message from './components/message'
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
    isMark: false,
    messages: [] as any,
    messageLoading: false,
    openMessage: false,
    message: "",
    messageType: "",
    messageId: null
  }

  componentDidMount() {
    this.props.onGetProfile()
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
    this.getIdleMessage()
  }

  getIdleMessage() {
    var params = (getCurrentInstance() as any).router.params
    idleMessageApi.getIdleMessage({ id: params.id }).then(res => {
      if (res.code == 0) {
        this.setState({
          messages: res.data,
          messageLoading: true
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
    markApi.addOrRemoveMark({ id: id, module: 'idle_application' }).then(res => {
      if (res.code == 0) {
        this.setState({
          isMark: !this.state.isMark
        })
      }
    })
  }

  onHandleMessage = (type) => {
    this.setState({
      messageType: type,
      openMessage: true
    })
  }

  onSubmitMessage = () => {
    var params = (getCurrentInstance() as any).router.params
    var data = {}
    const { messageType, message, messageId } = this.state
    switch (messageType) {
      case "answer":
        data = { id: params.id, comment: message, type: "buy", isReply: true }
        break;
      case "reply":
        data = { id: messageId, comment: message, type: "sale", isReply: true }
        break;
    }
    idleMessageApi.createIdleMessage(data).then(res => {
      if (res.code == 0) {
        this.setState({
          openMessage: false
        })
        this.getIdleMessage()
      }
    })
  }

  handleChangeMessage = (value) => {
    this.setState({
      message: value
    })
  }

  handleReply = (id) => {
    this.setState({
      messageType: 'reply',
      openMessage: true,
      messageId: id
    })
  }

  toRecord = (id) => {
    if (id != null) {
      Taro.navigateTo({
        url: "/packageIdle/pages/trade/index?id=" + id
      })
    } else {
      Taro.navigateTo({
        url: "/packageMe/pages/trade/index"
      })
    }
  }

  preview = (photos) => {
    var data = [] as any;
    photos.forEach(v => {
      data.push(v['url'])
    });
    Taro.previewImage({
      current: '', // 当前显示图片的http链接
      urls: data // 需要预览的图片http链接列表
    })
  }

  render() {
    const { detail, isMark, messages, messageLoading, openMessage, messageType, message } = this.state
    const { user } = this.props
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
                  return <SwiperItem key={item['title']} onClick={this.preview.bind(this, detail.photos)}>
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
                    {/* <Text>新旧程度：</Text><AtRate
                      className='oldDeep'
                      value={detail.oldDeep}
                    /> */}
                  </View>
                  <View className='at-col at-col-2'>
                    数量：x{detail.number}
                  </View>
                  <View className='at-col at-col-2' style='text-align:right'>
                    {
                      isMark ? <AtIcon value='heart-2' size='20' color='#ffb400' onClick={this.mark.bind(this, detail['id'])}></AtIcon>
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
            <View className='message'>
              问答区
            </View>
            <View className='message-content'>
              {
                messages.map(item => {
                  return (
                    <Message key={item.id} item={item} isReply={detail.profile.pid == user.profile.pid} onHandleReply={this.handleReply} />
                  )
                })
              }
              {
                messageLoading && messages.length == 0 && <View style='text-align:center; padding: 10px'>无记录</View>
              }
            </View>
          </ScrollView>
        }
        {
          detail &&
          <View className='trade'>
            <View className='at-row'>
              {
                detail.profile.pid != user.profile.pid && <View className='at-col at-col-1 at-col--auto' style='padding:0 20px' onClick={this.onHandleMessage.bind(this, "answer")}>
                  <AtIcon value='message' size='25' color='rgb(153, 153, 153)'></AtIcon>
                  <Text style='display: block;font-size: 12px'>提问</Text>
                </View>
              }
              {
                detail.status == 'Online' && detail.profile.pid != user.profile.pid && detail.idleRecord && detail.idleRecord.status == 'Doing'
                  ? <View className='at-col' style='padding:0'>
                    <AtButton type='primary' onClick={this.toRecord.bind(this, detail.idleRecord.id)}>
                      查看交易记录
                  </AtButton>
                  </View>
                  :
                  (detail.profile.pid == user.profile.pid ?
                    <View className='at-col' style='padding:0'>
                      <AtButton type='primary' onClick={this.toRecord.bind(this, null)}>
                        查看交易记录
                      </AtButton>
                    </View> : <View className='at-col' style='padding:0'>
                      <AtButton type='primary' disabled={detail.status == 'Online' ? false : true} onClick={this.addTrade}>
                        {detail.status == 'Online' ? "发起交易" : (detail.status == 'Doing' ? "交易中" : "下架")}
                      </AtButton>
                    </View>)
              }
            </View>
          </View>
        }
        <AtMessage />
        <AtModal isOpened={openMessage}>
          <AtModalHeader>{messageType == 'answer' ? '提问' : '回复'}</AtModalHeader>
          <AtModalContent>
            {openMessage && <AtTextarea
              value={message}
              onChange={this.handleChangeMessage.bind(this)}
              maxLength={200}
              placeholder='请输入...'
            />}
          </AtModalContent>
          <AtModalAction> <Button onClick={() => this.setState({ openMessage: false })}>取消</Button> <Button onClick={this.onSubmitMessage}>确定</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

