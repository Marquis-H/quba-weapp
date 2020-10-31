import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtFab, AtFloatLayout, AtInput, AtButton, AtTimeline } from 'taro-ui'
import Item from "./components/item";
import loveApi from '../../../api/love'

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
    isOpened: false,
    isCommentOpened: false,
    love: {},
    loves: [],
    guessValue: "",
    tips: null,
    comments: [],
    commentValue: ""
  }

  componentWillMount() {
    loveApi.getLoveList().then(res => {
      if (res.code == 0) {
        this.setState({
          loves: res.data
        })
      }
    })
  }

  onAdd() {
    Taro.navigateTo({
      url: "/packageLove/pages/application/index"
    })
  }

  onHandleLike = (index) => {
    const { loves } = this.state as any
    var love = loves[index] as any
    loveApi.updateLike({ id: love['id'] }).then(res => {
      if (res.code == 0) {
        love['like'] = love['like'] + 1;
        loves[index] = love;
        this.setState({
          loves: loves
        })
      }
    })
  }

  onHandleOpen = (index) => {
    const { loves } = this.state
    this.setState({
      isOpened: true,
      love: loves[index]
    })
  }

  handleClose() {
    this.setState({
      isOpened: false
    })
  }

  handleCai(value) {
    this.setState({
      guessValue: value
    })
  }

  handleGuess() {
    const { love, guessValue } = this.state as any
    if (guessValue != "") {
      loveApi.updateGuess({ id: love['id'], isGuess: love.name == guessValue }).then(res => {
        if (res.code == 0) {
          if (love.name == guessValue) {
            love['guessRight'] = love['guessRight'] + 1
            this.setState({
              tips: "猜中了"
            })
          } else {
            this.setState({
              tips: "很遗憾没有猜对"
            })
          }
          love['guess'] = love['guess'] + 1
          this.setState({
            guessValue: "",
            love: love
          })
        }
      })
    }
  }

  onHandleComment = (index) => {
    const { loves } = this.state
    var id = loves[index]["id"]
    loveApi.getComment({ id: id }).then(res => {
      if (res.code == 0) {
        this.setState({
          comments: this.changeCommentData(res.data),
          isCommentOpened: true,
          love: loves[index]
        })
      }
    })
  }

  handleCommentClose() {
    this.setState({
      isCommentOpened: false
    })
  }

  addComment = () => {
    const { love, commentValue } = this.state as any
    if (commentValue != "") {
      loveApi.addComment({ id: love["id"], comment: commentValue }).then(res => {
        if (res.code == 0) {
          this.setState({
            comments: this.changeCommentData(res.data),
            commentValue: ""
          })
        }
      })
    }
  }

  handleComment(value) {
    this.setState({
      commentValue: value
    })
  }

  changeCommentData(data) {
    data.forEach((element, index) => {
      data[index]["title"] = "匿名（" + (index + 1) + "楼）" + element["createdAt"]
    });

    return data;
  }

  render() {
    const { isOpened, loves, love, tips, guessValue, isCommentOpened, comments, commentValue } = this.state

    const scrollStyle = {
      height: '150px'
    }
    const scrollTop = 0
    const Threshold = 20
    return (
      <View className='container'>
        {
          loves.map((item, index) => {
            return (
              <Item
                index={index}
                key={index}
                item={item}
                onHandleOpen={this.onHandleOpen}
                onHandleLike={this.onHandleLike}
                onHandleComment={this.onHandleComment}
              />
            )
          })
        }
        <View className='cai-container'>
          <AtFloatLayout isOpened={isOpened} title='猜名字' onClose={this.handleClose.bind(this)}>
            已猜中 {love['guessRight']} 次，被猜 {love['guess']} 次
          <View className='cai'>
              <Text className='text' style='margin-left: 0'>猜猜发起者的名字</Text>
              <AtInput
                name='name'
                type='text'
                value={guessValue}
                placeholder='名字'
                className='input'
                onChange={this.handleCai.bind(this)}
              />
            </View>
            <AtButton type='primary' onClick={this.handleGuess.bind(this)}>猜...</AtButton>
            <View className='tips'>{tips}</View>
          </AtFloatLayout>
        </View>
        <AtFloatLayout isOpened={isCommentOpened} title='留言列表' onClose={this.handleCommentClose.bind(this)}>
          <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            scrollTop={scrollTop}
            style={scrollStyle}
            lowerThreshold={Threshold}
            upperThreshold={Threshold}
          >
            <AtTimeline
              pending
              items={comments}
            >
            </AtTimeline>
          </ScrollView>
          <AtInput
            name='name'
            type='text'
            value={commentValue}
            placeholder='请留言'
            className='input'
            onChange={this.handleComment.bind(this)}
          />
          <AtButton className='add-comment' type='primary' onClick={this.addComment}>留言</AtButton>
        </AtFloatLayout>
        <View className='add'>
          <AtFab onClick={this.onAdd.bind(this)}>
            <Text className='at-fab__icon at-icon at-icon-add'></Text>
          </AtFab>
        </View>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

