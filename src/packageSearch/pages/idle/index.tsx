import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView, Navigator, Input } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import idleApi from '../../../api/idle'
import Item from './components/item'
import { getIdleSearch } from '../../../actions/search'

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
  defaultKeyword: search.defaultKeyword,
  idleList: search.idles
}), (dispatch) => ({
  onGetIdleSearch(params) {
    dispatch(getIdleSearch(params))
  },
}))
class Index extends Component {
  state = {
    keyword: "",
    searchStatus: false,
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: null,
    filterCategoryList: [] as any,
    cId: 0
  }

  componentWillMount() {
    idleApi.getIdleCategory().then(res => {
      if (res.code == 0) {
        this.setState({
          filterCategoryList: res.data
        })
      }
    })
  }

  clearKeyword = () => {
    console.log('清空输入框数据');
    this.setState({
      keyword: '',
      searchStatus: false
    });
  }

  inputChange = (e) => {
    const { value } = e.target;
    this.setState({
      keyword: value,
      searchStatus: false,
    }, () => {
      if (value) {
        this.getHelpKeyword(value);
      }
    })
  }

  inputFocus = (e) => {
    const { value } = e.target;
    this.setState({
      searchStatus: false,
    }, () => {
      if (value) {
        this.getHelpKeyword(value);
      }
    })
  }

  onKeywordConfirm = (e) => {
    this.getSearchResult(e.target.value);
  }

  getSearchResult = (keyword) => {
    if (keyword === '') {
      keyword = this.props.defaultKeyword.keyword;
    }
    this.setState({
      keyword: keyword,
      cId: 0,
    }, () => {
      this.getList();
    });
  }


  getList = () => {
    const { cId, keyword, currentSortOrder } = this.state
    const { onGetIdleSearch } = this.props;
    idleApi.search({ cId: cId, keyword: keyword, currentSortOrder }).then(res => {
      if (res.code == 0) {
        onGetIdleSearch(res.data)
        this.setState({
          searchStatus: true,
          categoryFilter: false,
        })
      }
    })
    //重新获取关键词
    this.getSearchKeyword();
  }

  getSearchKeyword = () => {

  }

  /**
   * 获取搜索关键字
   */
  getHelpKeyword = (value) => {
    console.log(value)
  }

  closeSearch = () => {
    Taro.navigateBack()
  }

  openSortFilter = (currentId) => {
    switch (currentId) {
      case 'categoryFilter':
        this.setState({
          categoryFilter: !this.state.categoryFilter,
          currentSortType: 'category',
          currentSortOrder: 'desc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.state.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setState({
          currentSortType: 'price',
          currentSortOrder: tmpSortOrder,
          categoryFilter: false
        }, () => {
          this.getList();
        });
        break;
      default:
        //综合排序
        this.setState({
          currentSortType: 'default',
          currentSortOrder: null,
          categoryFilter: false,
          cId: 0,
        }, () => {
          this.getList();
        });
    }
  }

  selectCategory = (categoryIndex) => {
    const { filterCategoryList } = this.state;
    let currentIndex = categoryIndex;
    let filterCategory = filterCategoryList;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let currentCategory = null as any;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }

    this.setState({
      categoryFilter: false,
      cId: currentCategory.id
    }, () => {
      this.getList();
    });
  }

  render() {
    const { defaultKeyword, idleList } = this.props
    const { keyword, searchStatus, categoryFilter, currentSortType, currentSortOrder, filterCategoryList, cId } = this.state

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
              placeholder={defaultKeyword.keyword}
            />
            {keyword && <AtIcon className='del' size='14' color='#666' onClick={this.clearKeyword} value='close' />}
          </View>
          <View className='right' onClick={this.closeSearch}>取消</View>
        </View>
        {
          searchStatus && idleList.length && <View className='search-result'>
            <View className='sort'>
              <View className='sort-box'>
                <View className={`item ${currentSortType == 'default' ? 'active' : ''}`} onClick={() => this.openSortFilter('defaultSort')}>
                  <Text className='txt'>综合</Text>
                </View>
                <View className={`item ${currentSortType == 'price' ? 'active' : ''}`} onClick={() => this.openSortFilter('priceSort')}>
                  <Text className='txt'>价格</Text>
                  {
                    currentSortType == 'price' && currentSortOrder == 'asc' && <AtIcon value='chevron-up' size='18' color='#666' />
                  }
                  {
                    currentSortType == 'price' && currentSortOrder == 'desc' && <AtIcon value='chevron-down' size='18' color='#666' />
                  }
                </View>
                <View className={`item ${currentSortType == 'category' ? 'active' : ''}`} onClick={() => this.openSortFilter('categoryFilter')}>
                  <Text className='txt'>分类</Text>
                </View>
              </View>
              {
                categoryFilter && <View className='sort-box-category'>
                  {
                    Array.isArray(filterCategoryList) && filterCategoryList.map((item, index) => {
                      return <View className={`item ${item.id == cId ? 'active' : ''}`} key={item.id} onClick={() => this.selectCategory(index)}>{item.title}</View>
                    })
                  }
                </View>
              }
            </View>
            <View className='cate-item'>
              <View className='b'>
                {
                  idleList && idleList.map((item) => {
                    return <Navigator url={'/packageIdle/pages/detail/index?id=' + item.id} key={item.id}>
                      <Item item={item} />
                    </Navigator>
                  })
                }
              </View>
            </View>
          </View>
        }

        {
          !idleList.length && searchStatus && <View className='search-result-empty'>
            <Text className='text'>您寻找的商品还未上架</Text>
          </View>
        }
      </ScrollView>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

