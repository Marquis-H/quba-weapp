import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from '@tarojs/components';
import { AtTabBar, AtButton, AtInput } from 'taro-ui'
import Item from './components/item'

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
}

type PageOwnProps = {
  defaultKeyword: any,
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ search }) => ({
  defaultKeyword: search.defaultKeyword,
}), () => ({}))
class Index extends Component {
  state = {
    value: '',
    messages: [{
      nickname: 'Marquis Hou',
      avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/llnfgSfqI1YDkErib7PsUIKLMBSg04HdaWNeMv6y5dxTNX2zzZIYsiceX8dHEumYEZUTbIGX8h4f4XJ2qzW5dC2w/132",
      content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
      dateAt: "09:15",
      isMe: false
    },
    {
      nickname: 'Marquis Hou',
      avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/llnfgSfqI1YDkErib7PsUIKLMBSg04HdaWNeMv6y5dxTNX2zzZIYsiceX8dHEumYEZUTbIGX8h4f4XJ2qzW5dC2w/132",
      content: "测试测试测试测试测试测试测试测试测试测试测试测试",
      dateAt: "09:16",
      isMe: true
    }]
  }

  componentWillMount() {

  }

  handleClick = (value) => {
    console.log(value)
  }

  handleChange = (value) => {
    this.setState({
      value
    })
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  render() {
    const { value, messages } = this.state

    return (
      <View className='container'>
        <ScrollView className='content'>
          {
            messages.map((item, index) => {
              return (
                <View className='item' key={index}>
                  <Item item={item} />
                </View>
              )
            })
          }
        </ScrollView>
        <View className='send'>
          <View className='at-row'>
            <View className='at-col at-col-10 at-col--auto'>
              <AtInput
                name='value'
                type='text'
                placeholder='请输入...'
                value={value}
                onChange={this.handleChange.bind(this)}
              />
            </View>
            <View className='at-col'>
              <AtButton type='primary' size='small'>发送</AtButton>
            </View>
          </View>
        </View>
        <AtTabBar
          fixed
          tabList={[
            { title: '相片', iconType: 'image' },
            { title: '拍照', iconType: 'camera' },
          ]}
          onClick={this.handleClick.bind(this)}
          current={-1}
        />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

