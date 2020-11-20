import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Input, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';

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
  onGetIdleSearch: (any) => any
}

type PageOwnProps = {
  defaultKeyword: any,
  idleList: any
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ search }) => ({
  defaultKeyword: search.defaultKeyword
}), () => ({
}))
class Index extends Component {
  state = {
    keyword: "",
    messageList: []
  }

  componentWillMount() {

  }

  clearKeyword = () => {
    console.log('清空输入框数据');
    this.setState({
      keyword: '',
    });
  }

  inputChange = (e) => {
    const { value } = e.target;
    this.setState({
      keyword: value,
    }, () => {
      if (value) {
        this.getHelpKeyword(value);
      }
    })
  }

  inputFocus = (e) => {

  }

  onKeywordConfirm = (e) => {
    this.getSearchResult(e.target.value);
  }

  getSearchResult = (keyword) => {
    console.log(keyword)
  }


  getList = () => {

  }

  getSearchKeyword = () => {

  }

  /**
   * 获取搜索关键字
   */
  getHelpKeyword = (value) => {
    console.log(value)
  }

  /**
   * 取消
   */
  closeSearch = () => {

  }

  render() {
    const { keyword, messageList } = this.state

    return (
      <ScrollView className='container'>
        <View className='search-header'>
          <View className='input-box'>
            <AtIcon className='icon' size='18' color='#666' value='search' />
            <Input
              name='input'
              className='keyword'
              focus
              value={keyword}
              confirmType='search'
              onInput={this.inputChange}
              onFocus={this.inputFocus}
              onConfirm={this.onKeywordConfirm}
              placeholder='搜索'
            />
            {keyword && <AtIcon className='del' size='14' color='#666' onClick={this.clearKeyword} value='close' />}
          </View>
          <View className='right' onClick={this.closeSearch}>取消</View>
        </View>
        <View className='content'>
          {
            !messageList.length && <View className='search-result-empty'>
              <Text className='text'>无记录</Text>
            </View>
          }
        </View>
      </ScrollView>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

