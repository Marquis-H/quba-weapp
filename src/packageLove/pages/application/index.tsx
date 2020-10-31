import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text, Picker, Textarea } from '@tarojs/components'
import { AtInput, AtIcon, AtDivider, AtButton, AtMessage } from 'taro-ui'
import withLogin from "../../../utils/withLogin";
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
@withLogin('willMount')
class Index extends Component {
  state = {
    nickname: "",
    name: "",
    gender: 0,
    genderSelector: [
      {
        title: "请选择",
        value: null
      },
      {
        title: "男",
        value: "M"
      },
      {
        title: "女",
        value: "F"
      }
    ],
    taName: "",
    taGender: 0,
    content: ""
  }

  handleNicknameChange(value) {
    this.setState({
      nickname: value
    })
  }

  handleNameChange(value) {
    this.setState({
      name: value
    })
  }

  onGenderChange = (e) => {
    let index = e.detail.value
    this.setState({
      gender: index
    })
  }

  handleTaNameChange(value) {
    this.setState({
      taName: value
    })
  }

  onTaGenderChange = (e) => {
    let index = e.detail.value
    this.setState({
      taGender: index
    })
  }

  handleContentChange(e) {
    this.setState({
      content: e.detail.value
    })
  }

  handleCommit = () => {
    const { genderSelector, gender, taGender, nickname, name, taName, content } = this.state
    var errorMessages = [] as any
    if (nickname == '') {
      errorMessages.push("昵称") // 昵称、真名、TA的名字、内容
    }
    if (name == '') {
      errorMessages.push("真名") // 昵称、真名、TA的名字、内容
    }
    if (taName == '') {
      errorMessages.push("TA的名字") // 昵称、真名、TA的名字、内容
    }
    if (content == '') {
      errorMessages.push("内容") // 昵称、真名、TA的名字、内容
    }

    if (errorMessages.length > 0) {
      Taro.atMessage({
        'message': '请检查' + errorMessages.join(',') + '是否填写',
        'type': 'error'
      })

      return;
    }

    var genderValue = genderSelector[gender]['value'];
    var taGenderValue = genderSelector[taGender]['value'];

    loveApi.create({
      nickname: nickname,
      name: name,
      gender: genderValue,
      taName: taName,
      taGender: taGenderValue,
      content: content
    }).then(res => {
      if (res.code == 0) {
        Taro.navigateBack()
      } else {
        Taro.atMessage({
          'message': res.message,
          'type': 'error'
        })
      }
    })
  }

  render() {
    const { nickname, name, gender, genderSelector, taName, taGender, content } = this.state
    return (
      <View className='container'>
        <AtDivider content='你的信息' fontColor='#ffb400' lineColor='#ffb400' />
        <View className='input-container'>
          <Text className='text' style='color: #f0134d'>* </Text>
          <Text className='text' style='margin-left: 0'>你的昵称</Text>
          <AtInput
            name='nickname'
            value={nickname}
            type='text'
            className='input'
            onChange={this.handleNicknameChange.bind(this)}
          />
        </View>
        <View className='input-container'>
          <Text className='text' style='color: #f0134d'>* </Text>
          <Text className='text' style='margin-left: 0'>你的真名</Text>
          <AtInput
            name='name'
            value={name}
            type='text'
            className='input'
            onChange={this.handleNameChange.bind(this)}
          />
        </View>
        <Picker rangeKey='title' value={gender} mode='selector' range={genderSelector} onChange={this.onGenderChange} className='picker-container'>
          <Text className='text'>性别</Text>
          <View className='picker'>
            {genderSelector[gender].title}
            <AtIcon value='chevron-right' size='28' color='#DCDCDC'></AtIcon>
          </View>
        </Picker>
        <AtDivider content='TA的信息' fontColor='#ffb400' lineColor='#ffb400' />
        <View className='input-container'>
          <Text className='text' style='color: #f0134d'>* </Text>
          <Text className='text' style='margin-left: 0'>TA的名字、选择性别</Text>
          <AtInput
            name='taname'
            value={taName}
            type='text'
            className='input'
            onChange={this.handleTaNameChange.bind(this)}
          />
        </View>
        <Picker rangeKey='title' value={taGender} mode='selector' range={genderSelector} onChange={this.onTaGenderChange} className='picker-container'>
          <Text className='text'>性别</Text>
          <View className='picker'>
            {genderSelector[taGender].title}
            <AtIcon value='chevron-right' size='28' color='#DCDCDC'></AtIcon>
          </View>
        </Picker>
        <View className='input-container'>
          <Text className='text' style='color: #f0134d'>* </Text>
          <Text className='text' style='margin-left: 0'>表白的内容</Text>
          <Textarea
            value={content}
            className='textarea'
            autoHeight
            onInput={this.handleContentChange.bind(this)}
          />
        </View>
        <AtButton type='primary' className='commit' onClick={this.handleCommit}>提交</AtButton>
        <AtMessage />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

