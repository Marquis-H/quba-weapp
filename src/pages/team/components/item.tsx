import React, { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { AtTag, AtIcon, AtBadge } from 'taro-ui'
import * as images from '../../../../static/images/index';

import './item.scss'

interface Item {
    props: {
        item: any
    }
}

class Item extends Component {
    state = {
        onlineOrOffline: ["线下比赛", "线上比赛"],
        types: ["国家级", "省级", "市级", "校级", "院级"]
    }

    render() {
        const { onlineOrOffline, types } = this.state
        const { title, endAt, tabs, matchCategory, peopleLimit, qualificationLimit, marks, isTop } = this.props.item

        return (
            <View className='container'>
                <View className='post'>
                    <View className='post-body'>
                        <View className='content'>
                            <View className='at-row'>
                                <View className='at-col at-col-1 at-col--auto'>
                                    {
                                        isTop ? <AtBadge value='置顶'>
                                            <Image mode='aspectFill' className='img' src={images.logo} />
                                        </AtBadge> : <Image mode='aspectFill' className='img' src={images.logo} />
                                    }
                                </View>
                                <View className='at-col info'>
                                    <View className='at-row'>
                                        <View className='at-col at-col-10' style='padding:0'>
                                            <View className='title'>
                                                {title}
                                            </View>
                                        </View>
                                        <View className='at-col at-col-2' style='padding:0;text-align:center'>
                                            <AtIcon value='heart-2' size='16' color='#ffb400'></AtIcon>
                                            {marks}
                                        </View>
                                    </View>
                                    <View className='desp'>
                                        {qualificationLimit}
                                    </View>
                                    {
                                        matchCategory &&
                                        <View>
                                            <AtTag size='small' type='primary' circle active>{onlineOrOffline[tabs[0]]}</AtTag>
                                            <AtTag size='small' type='primary' circle active customStyle='margin-left:2px'>{types[matchCategory.type]}</AtTag>
                                            <AtTag size='small' type='primary' circle active customStyle='margin-left:2px'>{matchCategory.title}</AtTag>
                                        </View>
                                    }
                                    <View style='font-size:12px'>
                                        <Text>人数限制：{peopleLimit}</Text>
                                        <Text style='color: #b3b3b3;margin-right:10px;float:right'>结束时间：{endAt}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default Item