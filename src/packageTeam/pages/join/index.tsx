import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View } from '@tarojs/components'
import { AtTextarea, AtForm, AtButton, AtMessage } from 'taro-ui'
import teamApi from '../../../api/team'

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
    skills: '',
    matchExperience: '',
    contact: ''
  }

  handleChange(type, value) {
    switch (type) {
      case "skills":
        this.setState({
          skills: value
        })
        break;
      case "matchExperience":
        this.setState({
          matchExperience: value
        })
        break;
      case "contact":
        this.setState({
          contact: value
        })
        break;
    }
  }

  handleSubmit = () => {
    var params = (getCurrentInstance() as any).router.params
    const { skills, matchExperience, contact } = this.state
    var errorMessages = [] as any
    if (skills == '') {
      errorMessages.push("技能要求")
    }
    if (matchExperience == '') {
      errorMessages.push("比赛经验")
    }
    if (contact == '') {
      errorMessages.push("联系方式")
    }

    if (errorMessages.length > 0) {
      Taro.atMessage({
        'message': '请检查' + errorMessages.join('，') + '是否填写',
        'type': 'error'
      })

      return;
    }

    console.log(params)
    teamApi.addTeam({
      skills,
      matchExperience,
      contact,
      aid: params.id
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
    const { skills, matchExperience, contact } = this.state
    return (
      <View className='container'>
        <AtForm>
          <View className='title'>技能要求</View>
          <AtTextarea
            className='skill'
            value={skills}
            onChange={this.handleChange.bind(this, 'skills')}
            maxLength={200}
            placeholder='请输入技能要求'
          />
          <View className='title'>比赛经验</View>
          <AtTextarea
            className='matchExperience'
            value={matchExperience}
            onChange={this.handleChange.bind(this, 'matchExperience')}
            maxLength={200}
            placeholder='请输入比赛经验'
          />
          <View className='title'>联系方式</View>
          <AtTextarea
            className='contact'
            value={contact}
            onChange={this.handleChange.bind(this, 'contact')}
            maxLength={200}
            placeholder='请输入联系方式'
          />
          <View style='padding: 5px 0'></View>
        </AtForm>
        <AtButton type='primary' className='submit' onClick={this.handleSubmit}>提交</AtButton>
        <AtMessage />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

