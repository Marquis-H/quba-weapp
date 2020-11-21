import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

import './item.scss'

interface Item {
    props: {
        item: any
    }
}

class Item extends Component {
    render() {
        const { nickname, avatar, content, isMe } = this.props.item
        console.log(nickname)
        return (
            <View className={isMe ? 'container rtl' : 'container'}>
                <View className='message-detail'>
                    <View className='post-body'>
                        <View className='at-row'>
                            <View className='at-col at-col-1 at-col--auto'>
                                <AtAvatar circle image={avatar} size='small'></AtAvatar>
                            </View>
                            <View className='at-col info'>
                                <View className='at-row'>
                                    <View className='at-col at-col-10' style='padding:0'>
                                        <View className='title'>
                                            {nickname}
                                        </View>
                                        <View className='desp'>
                                            {content}
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