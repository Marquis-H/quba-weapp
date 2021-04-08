import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Picker } from '@tarojs/components'
import { AtForm, AtInput, AtTextarea, AtList, AtListItem, AtMessage, AtButton } from 'taro-ui'
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
    teamName: "",
    currentStatus: "",
    skill: "",
    skills: "",
    experience: "",
    people: "",
    joinEndAt: ""
  }

  handleChange(type, value) {
    switch (type) {
      case "teamName":
        this.setState({
          teamName: value
        })
        break;
      case "currentStatus":
        this.setState({
          currentStatus: value
        })
        break;
      case "skill":
        this.setState({
          skill: value
        })
        break;
      case "skills":
        this.setState({
          skills: value
        })
        break;
      case "experience":
        this.setState({
          experience: value
        })
        break;
      case "people":
        this.setState({
          people: value
        })
        break;
    }
  }

  onDateChange = (e) => {
    this.setState({
      joinEndAt: e.detail.value
    })
  }

  handleSubmit = () => {
    var params = (getCurrentInstance() as any).router.params

    const {
      teamName,
      currentStatus,
      skill,
      skills,
      experience,
      people,
      joinEndAt
    } = this.state

    var errorMessages = [] as any
    if (teamName == '') {
      errorMessages.push("队伍名称")
    }
    if (currentStatus == '') {
      errorMessages.push("项目现状")
    }
    // if (skill == '') {
    //   errorMessages.push("要求")
    // }
    // if (skills == '') {
    //   errorMessages.push("拥有技能")
    // }
    // if (experience == '') {
    //   errorMessages.push("经验要求")
    // }
    if (people == '') {
      errorMessages.push("人数")
    }
    if (joinEndAt == '') {
      errorMessages.push("加入队伍截止时间")
    }

    if (errorMessages.length > 0) {
      Taro.atMessage({
        'message': '请检查' + errorMessages.join('，') + '是否填写',
        'type': 'error'
      })

      return;
    }

    teamApi.create({
      teamName,
      currentStatus,
      skill,
      skills,
      experience,
      people,
      joinEndAt,
      mid: params.id
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
    const {
      teamName,
      currentStatus,
      skill,
      skills,
      // experience,
      people,
      joinEndAt
    } = this.state

    return (
      <View className='container'>
        <AtForm>
          <AtInput
            required
            name='teamName'
            title='队伍名称'
            type='text'
            placeholder='请输入队伍名称'
            value={teamName}
            onChange={this.handleChange.bind(this, 'teamName')}
          />
          <AtInput
            required
            name='currentStatus'
            title='项目现状'
            type='text'
            placeholder='请输入项目现状'
            value={currentStatus}
            onChange={this.handleChange.bind(this, 'currentStatus')}
          />
          <AtInput
            required
            name='people'
            title='人数'
            type='number'
            placeholder='请输入人数'
            value={people}
            onChange={this.handleChange.bind(this, 'people')}
          />
          <View className='title-nr'>要求</View>
          <AtTextarea
            className='skill'
            value={skill}
            onChange={this.handleChange.bind(this, 'skill')}
            maxLength={200}
            placeholder='请输入技能要求、经验要求、拥有技能'
          />
          {/* <View className='title'>经验要求</View>
          <AtTextarea
            className='experience'
            value={experience}
            onChange={this.handleChange.bind(this, 'experience')}
            maxLength={200}
            placeholder='请输入经验要求'
          /> */}
          <View className='title-nr'>拥有技能</View>
          <AtTextarea
            className='skill'
            value={skills}
            onChange={this.handleChange.bind(this, 'skills')}
            maxLength={200}
            placeholder='请输入自己的拥有技能'
          />
          <Picker value={joinEndAt} mode='date' onChange={this.onDateChange}>
            <AtList className='category' hasBorder={false}>
              <AtListItem
                hasBorder={false}
                title='加入队伍截止时间'
                extraText={joinEndAt}
              />
            </AtList>
          </Picker>
        </AtForm>
        <AtButton type='primary' className='submit' onClick={this.handleSubmit}>提交</AtButton>
        <AtMessage />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

