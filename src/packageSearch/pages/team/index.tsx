import Taro from '@tarojs/taro'
import React, { Component, ComponentClass } from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView, Navigator, Input } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import Item from './components/item'
import matchApi from '../../../api/match'
import { getTeamSearch } from '../../../actions/search'

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
  onGetTeamSearch: (any) => any
}

type PageOwnProps = {
  defaultKeyword: any,
  teamList: any
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ search }) => ({
  defaultKeyword: search.defaultKeyword,
  teamList: search.teams
}), (dispatch) => ({
  onGetTeamSearch(params) {
    dispatch(getTeamSearch(params))
  },
}))
class Index extends Component {
  state = {
    keyword: "",
    searchStatus: false,
    categoryFilter: false,
    currentSortType: 'default',
    createdAtOrder: null,
    filterCategoryList: [] as any,
    onlineOrOfflineList: [
      { value: 1, text: '线上比赛' },
      { value: 0, text: '线下比赛' }
    ],
    typesList: [
      {
        text: '国家级',
        value: '1'
      },
      {
        text: '省级',
        value: '2'
      },
      {
        text: '市级',
        value: '3'
      },
      {
        text: '校级',
        value: '4'
      },
      {
        text: '院级',
        value: '5'
      }
    ],
    cId: 0,
    isOnline: null,
    type: 0
  }

  componentWillMount() {
    matchApi.getMatchCategory().then(res => {
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

  getCategoryName(item) {
    var type = this.state.typesList.filter(value => value["value"] == item.type) as any
    console.log(type[0])
    return (item.isOnline ? "线上" : "线下") + "-" + type[0]['text'] + '-' + item.title
  }

  getList = () => {
    const { cId, keyword, createdAtOrder, isOnline, type } = this.state
    const { onGetTeamSearch } = this.props;
    matchApi.search({ cId: cId, keyword: keyword, createdAtOrder, isOnline, type }).then(res => {
      if (res.code == 0) {
        onGetTeamSearch(res.data)
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
          createdAtOrder: 'desc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.state.createdAtOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setState({
          currentSortType: 'price',
          createdAtOrder: tmpSortOrder,
          categoryFilter: false
        }, () => {
          this.getList();
        });
        break;
      default:
        //综合排序
        this.setState({
          currentSortType: 'default',
          createdAtOrder: null,
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
    const { defaultKeyword, teamList } = this.props
    const { keyword, searchStatus, categoryFilter, currentSortType, createdAtOrder, filterCategoryList, cId, onlineOrOfflineList, typesList } = this.state
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
          searchStatus && teamList.length && <View className='search-result'>
            <View className='sort'>
              <View className='sort-box'>
                <View className={`item ${currentSortType == 'default' ? 'active' : ''}`} onClick={() => this.openSortFilter('defaultSort')}>
                  <Text className='txt'>综合</Text>
                </View>
                <View className={`item ${currentSortType == 'price' ? 'active' : ''}`} onClick={() => this.openSortFilter('priceSort')}>
                  <Text className='txt'>创建时间</Text>
                  {
                    currentSortType == 'price' && createdAtOrder == 'asc' && <AtIcon value='chevron-up' size='18' color='#666' />
                  }
                  {
                    currentSortType == 'price' && createdAtOrder == 'desc' && <AtIcon value='chevron-down' size='18' color='#666' />
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
                      return <View className={`item ${item.id == cId ? 'active' : ''}`} key={item.id} onClick={() => this.selectCategory(index)}>{this.getCategoryName(item)}</View>
                    })
                  }
                </View>
              }
            </View>
            <View className='cate-item'>
              <View className='b'>
                {
                  teamList && teamList.map((item) => {
                    return <Navigator url={'/packageTeam/pages/info/index?id=' + item.id} key={item.id}>
                      <Item item={item} />
                    </Navigator>
                  })
                }
              </View>
            </View>
          </View>
        }

        {
          !teamList.length && searchStatus && <View className='search-result-empty'>
            <Text className='text'>您寻找的比赛还未上架</Text>
          </View>
        }
      </ScrollView>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>

