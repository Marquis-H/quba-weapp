import React, { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { AtTag, AtIcon } from 'taro-ui'
import { Domain } from '../../../../services/config'

import './item.scss'

interface Item {
    props: {
        item: any
    }
}

class Item extends Component {
    state = {}

    render() {
        const { famousPhoto, title, description, originalCost, currentCost, number, marks } = this.props.item

        return (
            <View className='container'>
                <View className='post'>
                    <View className='post-body'>
                        <View className='content'>
                            <View className='at-row'>
                                <View className='at-col at-col-1 at-col--auto'>
                                    <Image mode='aspectFill' className='img' src={Domain + famousPhoto} />
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
                                        {description}
                                    </View>
                                    <View>
                                        <AtTag size='small' type='primary' circle active>正在出售</AtTag>
                                    </View>
                                    <View style='color: #f7454e'>
                                        <Text style='font-size: 18px;'>¥</Text>{currentCost} <Text style='font-size: 12px;color: #b3b3b3;text-decoration: line-through'>¥{originalCost}</Text>
                                        <Text style='color: #b3b3b3;margin-right:10px;float:right'>x{number}</Text>
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