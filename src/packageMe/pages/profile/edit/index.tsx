import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import WeValidator from 'we-validator'
import { View, Picker, Text } from '@tarojs/components'
import { AtInput, AtMessage, AtButton, AtForm, AtRadio, AtIcon } from 'taro-ui'
import { updateProfile } from '../../../../actions/user'
import userApi from '../../../../api/user'
import authApi from '../../../../api/auth'
import commonApi from '../../../../api/common'

import './index.scss'

const mobileReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
WeValidator.addRule('mobileReg', {
  rule: function (value) {
    return mobileReg.test(value)
  }
})

function debounce(fn, ms) {
  let timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, arguments)
    }, ms)
  };
}
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
  onUpdatePriofile: (profile) => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user }) => ({ user }), (dispatch) => ({
  onUpdatePriofile(profile) {
    dispatch(updateProfile(profile))
  }
}))
class Index extends Component {
  constructor() {
    super("")
    this.handleMobileChange = debounce(this.handleMobileChange, 300)
  }

  state = {
    name: "",
    mobile: "",
    gender: "",
    sNo: "",
    college: "",
    professional: "",
    code: '',
    countdown: 60,
    vercodeFlag: false,
    editing: false,
    validatorInstance: this.updateWeValidator(),
    collegeOptions: [],
    collegeSelectorChecked: '请选择',
    professionalOptions: [],
    professionalSelectorChecked: '请选择',
  }

  componentWillMount() {
    var that = this
    this.setState({
      name: this.props.user.profile.name,
      mobile: this.props.user.profile.mobile,
      gender: this.props.user.profile.gender,
      sNo: this.props.user.profile.sNo,
      college: this.props.user.profile.college,
      professional: this.props.user.profile.professional
    })

    // colleges
    commonApi.getColleges().then(res => {
      if (res.code == 0) {
        this.setState({
          collegeOptions: res.data
        })
        res.data.forEach((element, i) => {
          if (element['id'] == that.props.user.profile.college) {
            (element['professionals'] as any).forEach((value, j) => {
              if (value['id'] == that.props.user.profile.professional) {
                that.setState({
                  professionalSelectorChecked: value['title'],
                  professionalOptions: element['professionals'],
                  professional: j
                })
              }
            });
            that.setState({
              collegeSelectorChecked: element['title'],
              college: i
            })
          }
        });
      }
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleNameChange(value) {
    this.setState({
      name: value,
      editing: true
    })
  }

  handleGenderChange(value) {
    this.setState({
      gender: value,
      editing: true
    })
  }

  handleSnoChange(value) {
    this.setState({
      sNo: value,
      editing: true
    })
  }

  handleMobileChange(value) {
    this.setState({
      mobile: value,
      editing: true,
      validatorInstance: this.updateWeValidator({
        code: {
          required: true,
          length: 6
        },
      })
    })
  }

  onCollegeChange = e => {
    let index = e.detail.value
    if (this.state.collegeOptions[index]) {
      let professionals = this.state.collegeOptions[index]["professionals"]
      this.setState({
        college: index,
        collegeSelectorChecked: this.state.collegeOptions[index]["title"],
        professionalOptions: professionals,
        professional: null,
        editing: true
      })
    }
  }

  onProfessionalChange = e => {
    let index = e.detail.value
    if (this.state.professionalOptions[index]) {
      this.setState({
        professional: index,
        professionalSelectorChecked: this.state.professionalOptions[index]["title"],
        editing: true
      })
    }
  }

  handleCodeChange = (value) => {
    this.setState({
      code: value,
      editing: true
    })

    return value
  }

  updateWeValidator(rules = {}, message = {}) {
    return new WeValidator({
      rules: {
        name: {
          required: true
        },
        gender: { required: true },
        mobile: {
          required: true,
          mobileReg: true
        },
        code: {
          length: 6
        },
        college: {
          required: true,
        },
        professional: {
          required: true,
        },
        ...rules
      },
      messages: {
        firstname: {
          required: '请输入姓名'
        },
        gender: { required: '请选择性别' },
        mobile: {
          required: '请输入手机号',
          mobileReg: '手机号格式不正确'
        },
        college: {
          required: '请选择学院'
        },
        professional: {
          required: '请选择专业'
        },
        code: {
          required: '请输入验证码',
          length: '请输入6位验证码'
        },
        ...message
      }
    })
  }

  handleVerCode = () => {
    let profile = {
      'mobile': this.state.mobile
    }
    authApi.getCaptcha(profile)
      .then(res => {
        const { message } = res
        Taro.atMessage({
          'message': message,
          'type': 'success',
        })
      })
      .catch(err => {
        console.log(err)
      })
    this.setState({
      vercodeFlag: true
    }, () => {
      const timer = setInterval(() => {
        this.setState({
          countdown: this.state.countdown - 1
        }, () => {
          if (this.state.countdown === 0) {
            clearInterval(timer)
            this.setState({
              vercodeFlag: false,
              countdown: 60
            })
          }
        })
      }, 1000)
    })

  }

  onSubmit() {
    let { name,
      gender,
      sNo,
      college,
      professional,
      mobile,
      code } = this.state
    if (!this.state.validatorInstance.checkData({
      name,
      gender,
      sNo,
      college,
      professional,
      mobile,
      code
    })) return

    this.handleSave()
  }

  async handleSave() {
    let collegeId = this.state.collegeOptions[this.state.college] ? this.state.collegeOptions[this.state.college]["id"] : null
    let professionaId = this.state.professionalOptions[this.state.professional] ? this.state.professionalOptions[this.state.professional]["id"] : null
    let profile = {
      name: this.state.name,
      mobile: this.state.mobile,
      gender: this.state.gender,
      sNo: this.state.sNo,
      college: collegeId,
      professional: professionaId,
      captcha: this.state.code,
    }
    try {
      let res = await userApi.updateProfile(profile)
      if (res.code === 0) {
        await this.saveInLocal(res.data)
        Taro.navigateBack()
      } else {
        throw res;
      }
    } catch (e) {
      Taro.atMessage({
        'message': e.message,
        'type': 'error',
      })
    }
  }

  async saveInLocal(data) {
    await this.props.onUpdatePriofile(data)
  }

  render() {
    const { name, sNo, mobile, gender, college, professional } = this.state
    return (
      <View className='container'>
        <AtForm
          className='edit-bg'
          onSubmit={this.onSubmit.bind(this)}
        >
          <Text className='text' style='color: #f0134d'>* </Text>
          <Text className='text' style='margin-left: 0'>姓名</Text>
          <AtInput
            name='name'
            value={name}
            type='text'
            placeholder='請輸入姓名'
            className='input'

            onChange={this.handleNameChange.bind(this)}
          />
          <Text className='text' style='color: #f0134d'>* </Text>
          <Text className='text' style='margin-left: 0'>性別</Text>
          <AtRadio
            options={[
              { label: '男', value: 'M' },
              { label: '女', value: 'F' },
            ]}
            value={gender}
            onClick={this.handleGenderChange.bind(this)}
          />
          <Text className='text'>学号</Text>
          <AtInput
            name='sNo'
            value={sNo}
            type='text'
            placeholder='請輸入学号'
            className='input'

            onChange={this.handleSnoChange.bind(this)}
          />
          <Picker rangeKey='title' value={college as any} mode='selector' range={this.state.collegeOptions} onChange={this.onCollegeChange} className='picker-container'>
            <Text className='text' style='margin-left: 0'>学院</Text>
            <View className='picker'>
              {this.state.collegeSelectorChecked}
              <AtIcon value='chevron-right' size='28' color='#DCDCDC'></AtIcon>
            </View>
          </Picker>
          <Picker rangeKey='title' value={professional as any} mode='selector' range={this.state.professionalOptions} onChange={this.onProfessionalChange} className='picker-container'>
            <Text className='text' style='margin-left: 0'>专业</Text>
            <View className='picker'>
              {this.state.professionalSelectorChecked}
              <AtIcon value='chevron-right' size='28' color='#DCDCDC'></AtIcon>
            </View>
          </Picker>
          <Text className='text' style='color: #f0134d'>* </Text>
          <Text className='text' style='margin-left: 0'>手机号码</Text>
          <View className='mobile-content'>
            <AtInput
              name='mobile'
              value={mobile}
              type='text'
              placeholder='请输入手机号码'
              className='my-mobile-input'
              onChange={this.handleMobileChange.bind(this)}
            />
            <Text className='my-text'> </Text>
            <AtInput
              name='code'
              type='text'
              maxlength={6}
              placeholder='验证码'
              disabled={!this.state.editing}
              className='input'
              value={this.state.code}
              onChange={this.handleCodeChange}
            >
              {!this.state.vercodeFlag && <View onClick={this.handleVerCode}>发送验证码</View>}
              {this.state.vercodeFlag && <View>{this.state.countdown} 秒后重试</View>}
            </AtInput>
          </View>

          <AtButton className='save-btn' onClick={this.onSubmit.bind(this)} type='primary' disabled={!this.state.editing}>保存</AtButton>
          <AtMessage />
        </AtForm>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

