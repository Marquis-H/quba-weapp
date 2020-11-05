import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Picker } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtMessage, AtList, AtListItem, AtTextarea, AtRate, AtImagePicker } from 'taro-ui'
import { Domain } from '../../../services/config'
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
    name: '', // 名称
    category: 0, // 类别
    number: '1',
    originalCost: '',
    currentCost: '',
    originalUrl: '',
    remark: '',
    oldDeep: 0,
    contactType: 0,
    contact: '',
    description: '',
    famousPhoto: [],
    photos: [] as any,
    categorySelector: [] as any,
    contactSelector: [
      {
        value: 1,
        title: '手机',
      },
      {
        value: 2,
        title: '微信',
      }
    ]
  }

  componentWillMount() {
    idleApi.getIdleCategory().then(res => {
      if (res.code == 0) {
        this.setState({
          categorySelector: res.data
        })
      }
    })
  }

  handleChange(type, value) {
    switch (type) {
      case 'name':
        this.setState({
          name: value
        })
        break;
      case 'number':
        this.setState({
          number: value
        })
        break;
      case 'oldDeep':
        this.setState({
          oldDeep: value
        })
        break;
      case 'originalCost':
        this.setState({
          originalCost: value
        })
        break;
      case 'currentCost':
        this.setState({
          currentCost: value
        })
        break;
      case 'originalUrl':
        this.setState({
          originalUrl: value
        })
        break;
      case 'remark':
        this.setState({
          remark: value
        })
        break;
      case 'contact':
        this.setState({
          contact: value
        })
        break;
      case 'description':
        this.setState({
          description: value
        })
        break;
    }
  }

  onCategoryChange = (e) => {
    this.setState({
      category: e.detail.value
    })
  }

  onContactChange = (e) => {
    this.setState({
      contactType: e.detail.value
    })
  }

  onFamousPhotoChange = (files, operationType) => {
    var that = this
    if (operationType == 'add') {
      files.forEach(element => {
        Taro.uploadFile({
          url: Domain + '/api/v1/weapp/upload/image', //仅为示例，非真实的接口地址
          filePath: element.url,
          name: 'file',
          formData: {},
          success(res) {
            const data = JSON.parse(res.data)
            //do something
            if (data['code'] == 0) {
              that.setState({
                famousPhoto: [{ "url": Domain + data['data']['file'], file: data['data']['file'] }]
              })
            }
          }
        })
      });
    } else if (operationType == 'remove') {
      this.setState({
        famousPhoto: []
      })
    }
  }

  onPhotoChange = (files, operationType, index) => {
    var that = this
    if (operationType == 'add') {
      files.forEach(element => {
        Taro.uploadFile({
          url: Domain + '/api/v1/weapp/upload/image', //仅为示例，非真实的接口地址
          filePath: element.url,
          name: 'file',
          formData: {},
          success(res) {
            const data = JSON.parse(res.data)
            //do something
            if (data['code'] == 0) {
              const { photos } = that.state
              photos.push({ url: Domain + data['data']['file'], file: data['data']['file'] })
              that.setState({
                photos: photos
              })
            }
          }
        })
      });
    } else if (operationType == 'remove') {
      const { photos } = that.state
      photos.splice(index, 1);
      this.setState({
        photos: photos
      })
    }
  }

  handleSubmit = () => {
    const {
      categorySelector,
      contactSelector,
      name,
      category,
      number,
      originalCost,
      currentCost,
      oldDeep,
      contactType,
      contact,
      description,
      famousPhoto,
      photos
    } = this.state
    var errorMessages = [] as any
    if (name == '') {
      errorMessages.push("名称")
    }
    if (category == -1) {
      errorMessages.push("类别")
    }
    if (number == '') {
      errorMessages.push("数量")
    }
    if (originalCost == '') {
      errorMessages.push("原价")
    }
    if (currentCost == '') {
      errorMessages.push("现价")
    }
    if (oldDeep == 0) {
      errorMessages.push("新旧程度")
    }
    if (contactType == -1) {
      errorMessages.push("联系方式")
    }
    if (contact == '') {
      errorMessages.push("联系内容")
    }
    if (description == '') {
      errorMessages.push("商品详情")
    }
    if (famousPhoto.length == 0) {
      errorMessages.push("封面图")
    }
    if (photos.length == 0) {
      errorMessages.push("商品详情图")
    }

    if (errorMessages.length > 0) {
      Taro.atMessage({
        'message': '请检查' + errorMessages.join('，') + '是否填写',
        'type': 'error'
      })

      return;
    }

    var categoryValue = categorySelector[category]['id'];
    var contactTypeValue = contactSelector[contactType]['title'];

    idleApi.create({
      name,
      category: categoryValue,
      number,
      originalCost,
      currentCost,
      oldDeep,
      contactType: contactTypeValue,
      contact,
      description,
      famousPhoto,
      photos
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
      categorySelector,
      contactSelector,
      name,
      category,
      number,
      originalCost,
      currentCost,
      originalUrl,
      remark,
      oldDeep,
      contactType,
      contact,
      description,
      famousPhoto,
      photos
    } = this.state

    return (
      <View className='container'>
        <AtForm>
          <AtInput
            required
            name='name'
            title='商品名称'
            type='text'
            placeholder='请输入商品名称'
            value={name}
            onChange={this.handleChange.bind(this, 'name')}
          />
        </AtForm>
        <AtForm>
          <Picker rangeKey='title' value={category} mode='selector' range={categorySelector} onChange={this.onCategoryChange}>
            <AtList className='category' hasBorder={false}>
              <AtListItem
                arrow='right'
                title='商品分类'
                extraText={categorySelector[category] ? categorySelector[category].title : ''}
              />
            </AtList>
          </Picker>
          <AtInput
            required
            name='number'
            title='数量'
            type='number'
            placeholder='请输入数量'
            value={number}
            onChange={this.handleChange.bind(this, 'number')}
          />
          <View className='rate'>
            <View className='title'>
              新旧程度
            </View>
            <AtRate
              className='oldDeep'
              value={oldDeep}
              onChange={this.handleChange.bind(this, 'oldDeep')}
            />
          </View>
          <AtInput
            required
            name='originalCost'
            title='商品原价'
            type='text'
            placeholder='请输入单个商品原件'
            value={originalCost}
            onChange={this.handleChange.bind(this, 'originalCost')}
          />
          <AtInput
            required
            name='currentCost'
            title='商品现价'
            type='text'
            placeholder='请输入单个商品现价'
            value={currentCost}
            onChange={this.handleChange.bind(this, 'currentCost')}
          />
          <AtInput
            name='originalUrl'
            title='购买链接'
            type='text'
            placeholder='初次购买时的链接'
            value={originalUrl}
            onChange={this.handleChange.bind(this, 'originalUrl')}
          />
          <AtInput
            border={false}
            name='remark'
            title='备注'
            type='text'
            placeholder='选填'
            value={remark}
            onChange={this.handleChange.bind(this, 'remark')}
          />
        </AtForm>
        <AtForm>
          <Picker rangeKey='title' value={contactType} mode='selector' range={contactSelector} onChange={this.onContactChange}>
            <AtList className='category' hasBorder={false}>
              <AtListItem
                arrow='right'
                title='联系方式'
                extraText={contactSelector[contactType].title}
              />
            </AtList>
          </Picker>
          <AtInput
            required
            name='contact'
            title='联系内容'
            type='text'
            placeholder='单行文本'
            value={contact}
            onChange={this.handleChange.bind(this, 'contact')}
          />
        </AtForm>
        <AtForm>
          <AtTextarea
            className='description'
            value={description}
            onChange={this.handleChange.bind(this, 'description')}
            maxLength={200}
            placeholder='请输入商品详情'
          />
        </AtForm>
        <AtForm>
          <View className='photo-title'>
            上传商品封面图
          </View>
          <AtImagePicker
            className={famousPhoto.length == 0 ? 'famous-add' : 'famous-remove'}
            multiple={false}
            length={4}
            count={1}
            files={famousPhoto}
            onChange={this.onFamousPhotoChange.bind(this)}
          />
        </AtForm>
        <AtForm>
          <View className='photo-title'>
            上传商品详情图片
          </View>
          <AtImagePicker
            length={4}
            count={1}
            files={photos}
            onChange={this.onPhotoChange.bind(this)}
          />
        </AtForm>
        <AtButton type='primary' className='submit' onClick={this.handleSubmit}>提交</AtButton>
        <AtMessage />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

