import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Swiper, SwiperItem, Image, Text, Button } from '@tarojs/components'
import { AtIcon, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtTextarea } from 'taro-ui'
import topicApi from '../../../api/topic'
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
    hotTopic: null as any,
    openComment: false,
    comment: "",
    loadingComment: false
  }

  componentDidMount() {
    topicApi.getHotTopic().then(res => {
      if (res.code == 0) {
        this.setState({
          loadingComment: true,
          hotTopic: res.data
        })
        // view
        topicApi.addView({ id: res.data.id }).then(r => {
          if (r.code == 0) {
            var hotTopic = res.data
            hotTopic.views = res.data.views + 1
            this.setState({
              hotTopic: hotTopic
            })
          }
        })
      }
    })
  }

  // 获取热门话题
  getHotTopic() {
    topicApi.getHotTopic().then(res => {
      if (res.code == 0) {
        this.setState({
          loadingComment: true,
          hotTopic: res.data
        })
      }
    })
  }

  onHandleMessage = () => {
    this.setState({
      openComment: true,
      comment: ''
    })
  }

  handleChangeComment(value) {
    this.setState({
      comment: value
    })
  }

  onSubmitComment = () => {
    const { hotTopic, comment } = this.state
    topicApi.addComment({ id: hotTopic.id, comment: comment }).then(res => {
      if (res.code == 0) {
        this.setState({
          openComment: false
        })
        this.getHotTopic()
      }
    })
  }

  handleToLike(id, type) {
    topicApi.addLike({ id, type }).then(res => {
      if (res.code == 0) {
        this.getHotTopic()
      }
    })
  }

  render() {
    const { hotTopic, openComment, comment, loadingComment } = this.state

    return (
      <View className='container'>
        {
          hotTopic && <View>
            <Swiper
              className='swiper'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay
            >
              {
                hotTopic.photos && hotTopic.photos.map((photo, index) => {
                  var file = photo['response']['data']['file']
                  return (
                    <SwiperItem key={index}>
                      <View className='photo'>
                        <Image src={Domain + file} mode='aspectFill' className='img' />
                      </View>
                    </SwiperItem>
                  )
                })
              }
            </Swiper>
            <View className='content'>
              <View className='title'>
                {hotTopic['title']}
              </View>
              <View className='desp'>
                {hotTopic['content']}
              </View>
            </View>
            <View className='static'>
              <View className='at-row'>
                <View className='at-col at-col-5' style='display: flex;'>
                  <View className='at-row'>
                    <View className='at-col at-col-1 at-col--auto avatar'>
                      <Image mode='aspectFill' className='img' src={hotTopic.publisher.avatar} />
                    </View>
                    <View className='at-col info'>
                      <View className='at-row'>
                        <View className='at-col at-col-12' style='padding:5px 0'>
                          <View className='title'>
                            {hotTopic.publisher.nickname}
                          </View>
                          <View className='desp'>
                            {hotTopic.createdAt}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='at-col at-col-7 static-r'>
                  <View className='at-row'>
                    <View className='at-col at-col-3' style='text-align: center'>
                    </View>
                    <View className='at-col at-col-3' style='text-align: center'>
                      <AtIcon value='eye' size='15' color='#F00'></AtIcon>
                      <Text style='font-size:14px'>{hotTopic.views}</Text>
                    </View>
                    <View className='at-col at-col-3' style='text-align: center' onClick={this.handleToLike.bind(this, hotTopic.id, 'topic')}>
                      <AtIcon value='heart-2' size='15' color='#F00'></AtIcon>
                      <Text style='font-size:14px'>{hotTopic.like}</Text>
                    </View>
                    <View className='at-col at-col-3' style='text-align: center' onClick={this.onHandleMessage}>
                      <AtIcon value='message' size='15' color='#F00'></AtIcon>
                      <Text style='font-size:14px'>{hotTopic.comments.length}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className='comment-title'>
                讨论区
          </View>
              <View className='comment-container'>
                {
                  hotTopic.comments && hotTopic.comments.map((item, index) => {
                    return (
                      <View className='at-row' key={index}>
                        <View className='at-col at-col-1 at-col--auto'>
                          <Image mode='aspectFill' className='img' src={item.profile.user.avatar} />
                        </View>
                        <View className='at-col info'>
                          <View className='at-row'>
                            <View className='at-col at-col-12' style='padding:5px 0'>
                              <View className='title'>
                                {item.profile.user.nickname}
                              </View>
                              <View className='desp'>
                                {item.comment}
                              </View>
                              <View className='at-row sta'>
                                <View className='at-col at-col-6'>
                                  {item.createdAt}
                                </View>
                                <View className='at-col at-col-6' style='text-align: right' onClick={this.handleToLike.bind(this, item.id, 'comment')}>
                                  <AtIcon value='heart-2' size='15' color='#F00'></AtIcon> {item.like}
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    )
                  })
                }
                {
                  loadingComment && hotTopic.comments.length == 0 && <View style='text-align: center'>
                    无记录
                </View>
                }
              </View>
            </View>
            <AtModal isOpened={openComment}>
              <AtModalHeader>评论</AtModalHeader>
              <AtModalContent>
                {
                  openComment && <AtTextarea
                    value={comment}
                    onChange={this.handleChangeComment.bind(this)}
                    maxLength={200}
                    placeholder='请输入...'
                  />
                }
              </AtModalContent>
              <AtModalAction> <Button onClick={() => this.setState({ openComment: false })}>取消</Button> <Button onClick={this.onSubmitComment}>确定</Button> </AtModalAction>
            </AtModal>
          </View>
        }
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

