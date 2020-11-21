import React, { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { AtBadge } from 'taro-ui'

import './item.scss'

interface Item {
    props: {
        item: any
    }
}

class Item extends Component {
    render() {
        const { avatar, nickname, content, badge, lastAt } = this.props.item

        return (
            <View className='container'>
                <View className='post'>
                    <View className='post-body'>
                        <View className='content'>
                            <View className='at-row'>
                                <View className='at-col at-col-1 at-col--auto'>
                                    {
                                        badge > 0 ? <AtBadge value={badge}>
                                            <Image mode='aspectFill' className='img' src={avatar} />
                                        </AtBadge> : <Image mode='aspectFill' className='img' src={avatar} />
                                    }
                                </View>
                                <View className='at-col info'>
                                    <View className='at-row'>
                                        <View className='at-col at-col-10' style='padding:5px 0'>
                                            <View className='title'>
                                                {nickname}
                                            </View>
                                            <View className='desp'>
                                                {content}
                                            </View>
                                        </View>
                                        <View className='at-col at-col-2' style='font-size:12px'>
                                            <Text style='color: #b3b3b3;float:right'>{lastAt}</Text>
                                        </View>
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