import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui';

import './box.scss'

interface Item {
    props: {
        categoryList: any,
        onHandleBox: Function
    }
}

class Item extends Component {
    state = {
        currentSortType: 'default',
        createdAtOrder: null,
        categoryFilter: false,
        cId: 0,
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
        ]
    }

    getList() {
        const { cId, createdAtOrder } = this.state
        this.props.onHandleBox(cId, createdAtOrder)
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
        const { categoryList } = this.props;
        let currentIndex = categoryIndex;
        let filterCategory = categoryList;
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

    getCategoryName(item) {
        var type = this.state.typesList.filter(value => value["value"] == item.type) as any
        console.log(type[0])
        return (item.isOnline ? "线上" : "线下") + "-" + type[0]['text'] + '-' + item.title
    }

    render() {
        const { currentSortType, createdAtOrder, cId, categoryFilter } = this.state
        const { categoryList } = this.props

        return (
            <View className='container'>
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
                                Array.isArray(categoryList) && categoryList.map((item, index) => {
                                    return <View className={`item ${item.id == cId ? 'active' : ''}`} key={item.id} onClick={() => this.selectCategory(index)}>{this.getCategoryName(item)}</View>
                                })
                            }
                        </View>
                    }
                </View>
            </View>
        )
    }
}

export default Item