import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtButton, AtModal, AtToast } from "taro-ui"
import idleApi from '../../../api/idle'

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
    viewContactType: false,
    idleType: null
  }

  componentWillMount() {
    var params = (getCurrentInstance() as any).router.params
    this.setState({
      idleType: params.slug
    })
    idleApi.trade({ id: params.id }).then(res => {
      if (res.code == 0) {
        this.setState({
          detail: res.data
        })
      }
    })
  }

  toViewContactType = () => {
    this.setState({
      viewContactType: !this.state.viewContactType
    })
  }

  toCopyContactType = () => {
    const { detail, idleType } = this.state
    Taro.setClipboardData({
      data: idleType == 'sale' ? detail.profile.mobile : detail.application.contact,
      success() {
        Taro.showToast({
          title: '已复制',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }

  toApplication = (id) => {
    Taro.navigateTo({
      url: "/packageIdle/pages/detail/index?id=" + id
    })
  }

  handleChangeTrade = (id, status, title) => {
    var that = this
    Taro.showModal({
      title: '提示',
      content: title,
      success: function (res) {
        if (res.confirm) {
          idleApi.changeTrade({ id: id, status }).then(response => {
            if (response.code == 0) {
              that.setState({
                detail: response.data
              })
            }
          })
        }
      }
    })
  }

  render() {
    const { detail, viewContactType, idleType } = this.state

    return (
      <View className='container'>
        {
          detail &&
          <View className='trade'>
            <AtList className='item'>
              <AtListItem title='交易编号' extraText={detail.receipt} />
              <AtListItem title='商品名称' extraText={detail.application.title} />
              <AtListItem title='商品单价' extraText={"¥" + detail.application.currentCost} />
              <AtListItem title='购买数量' extraText={detail.application.number} />
              <AtListItem title='价格' extraText={"¥" + detail.application.currentCost} />
              <AtListItem title='交易发起时间' extraText={detail.tradeAt} />
              <AtListItem title='交易状态' extraText={detail.statusTitle} />
              <AtListItem title='交易结束时间' extraText={detail.tradeEndAt ? detail.tradeEndAt : '-'} />
            </AtList>
            {
              idleType == 'sale' &&
              <View className='action'>
                <AtButton type='primary' onClick={this.toViewContactType}>查看对方联系方式</AtButton>
                {
                  detail.status == "Doing" && <AtButton type='primary' onClick={this.handleChangeTrade.bind(this, detail.id, 'Done', '确认交易完成?')}>确认交易完成</AtButton>
                }
              </View>
            }
            {
              idleType != 'sale' &&
              <View className='action'>
                <AtButton type='primary' onClick={this.toViewContactType}>查看对方联系方式</AtButton>
                <AtButton type='primary' onClick={this.toApplication.bind(this, detail.application.id)}>查看商品详情</AtButton>
                {
                  detail.status == "Doing" && <AtButton onClick={this.handleChangeTrade.bind(this, detail.id, 'Cancel', '取消交易?')}>取消交易</AtButton>
                }
              </View>
            }
            <AtModal
              isOpened={viewContactType}
              confirmText='复制号码'
              cancelText='关闭'
              onCancel={this.toViewContactType}
              onClose={this.toViewContactType}
              onConfirm={this.toCopyContactType}
              content={idleType == 'sale' ? ("买家手机联系方式：" + detail.profile.mobile) : ("卖家" + detail.application.contactType + "联系方式：" + detail.application.contact)}
            />
          </View>
        }
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

