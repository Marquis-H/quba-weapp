import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View } from '@tarojs/components'
import webApi from '../../api/web'
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
    html: '',
  }

  componentWillMount() {
    console.log(getCurrentInstance())
    var params = (getCurrentInstance() as any).router.params
    console.log(params.title)
    Taro.setNavigationBarTitle({
      title: params.title
    })
    switch (params.title) {
      case '常见问题':
        webApi.getPage({ slug: 'question' }).then(res => {
          console.log(res.data.content)
          this.setState({
            html: res.data.content
          })
        })
        break
      case '联系我们':
        webApi.getPage({ slug: 'contact' }).then(res => {
          this.setState({
            html: res.data.content
          })
        })
        break
    }
  }

  render() {
    return (
      <View className='container'>
        <View className='bd'>
          <View className='page-content'>
            {
              this.state.html != '' && <View dangerouslySetInnerHTML={{ __html: this.state.html }}></View>
            }
          </View>
        </View>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

