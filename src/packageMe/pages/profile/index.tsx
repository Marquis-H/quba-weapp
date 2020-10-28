import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from "taro-ui"
import commonApi from '../../../api/common'

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

@connect(({ user }) => ({ user }), () => ({}))
class Index extends Component {
  state = {
    collegeTitle: '',
    professionalTitle: ''
  }

  componentWillUnmount() { }

  componentDidShow() {
    const { college, professional } = this.props.user.profile
    var that = this
    // colleges
    commonApi.getColleges().then(res => {
      if (res.code == 0) {
        res.data.forEach(element => {
          if (element['id'] == college) {
            that.setState({
              collegeTitle: element['title']
            })
          }
          (element['professionals'] as any).forEach(value => {
            if (value['id'] == professional) {
              that.setState({
                professionalTitle: value['title']
              })
            }
          });
        });
      }
    })
  }

  componentDidHide() { }

  goToEdit() {
    Taro.navigateTo({
      url: 'edit/index'
    })
  }

  render() {
    const { profile } = this.props.user
    const { collegeTitle, professionalTitle } = this.state
    return (
      <View className='container'>
        <View className='profile-content'>
          <AtAvatar image={profile.avatar} circle className='my-avatar' size='large'></AtAvatar>
          <View className='profile-item'>
            <Text className='text'>姓名</Text>
            <Text>{profile.name ? profile.name : '空'}</Text>
          </View>
          <View className='profile-item'>
            <Text className='text'>性别</Text>
            <Text>{profile.gender === 'M' ? '男' : profile.gender === 'F' ? '女' : '空'}</Text>
          </View>
          <View className='profile-item'>
            <Text className='text'>学号</Text>
            <Text>{profile.sNo ? profile.sNo : '空'}</Text>
          </View>
          <View className='profile-item'>
            <Text className='text'>学院</Text>
            <Text>{profile.college ? collegeTitle : '空'}</Text>
          </View>
          <View className='profile-item'>
            <Text className='text'>专业</Text>
            <Text>{profile.professional ? professionalTitle : '空'}</Text>
          </View>
          <View className='profile-item'>
            <Text className='text'>手机号</Text>
            <Text>{profile.mobile ? profile.mobile : '空'}</Text>
          </View>
        </View>
        <View className='edit-btn' onClick={this.goToEdit}>编辑信息</View>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

