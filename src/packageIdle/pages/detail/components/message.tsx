import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { AtAvatar, AtButton, AtDivider } from 'taro-ui'

import './message.scss'

interface Message {
    props: {
        item: any,
        onHandleReply: Function,
        isReply: boolean
    }
}

class Message extends Component {
    state = {}

    render() {
        const { item, isReply } = this.props

        return (
            <View className='message-container'>
                <View className='at-row' style='margin-bottom: 5px'>
                    <View className='at-col at-col-1 at-col--auto'>
                        <AtAvatar circle image={item.buyProfile.user.avatar}></AtAvatar>
                    </View>
                    <View className='at-col at-col-8' style='padding: 10px 5px'>
                        <View>{item.buyProfile.user.nickname}</View>
                        <View style='font-size: 12px'>{item.buyCommentAt}</View>
                    </View>
                    {
                        isReply && <View className='at-col'>
                            <AtButton type='secondary' size='small' onClick={() => { this.props.onHandleReply(item.id) }}>回复</AtButton>
                        </View>
                    }
                </View>
                <View style='padding: 0 5px; font-size: 13px'>
                    {item.buyComment}
                </View>
                {
                    item.saleComment.map((value, index) => {
                        return (
                            <View key={index}>
                                <AtDivider height='40' />
                                <View className='at-row'>
                                    <View className='at-col at-col-1 at-col--auto'>
                                        <AtAvatar size='small' circle image={item.saleProfile.user.avatar}></AtAvatar>
                                    </View>
                                    <View className='at-col at-col-8'>
                                        <View>{item.saleProfile.user.nickname}</View>
                                        <View style='font-size: 13px'>{value}</View>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}

export default Message