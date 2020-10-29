import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtIcon } from "taro-ui";
import './item.scss'

interface Item {
    props: {
        onHandleOpen: Function,
        onHandleLike: Function,
        item: object,
        index: number
    }
}

class Item extends Component {
    state = {
        isLike: false
    }

    onHandleStar = (index) => {
        this.props.onHandleOpen(index)
    }

    onHandleLike = (index) => {
        this.props.onHandleLike(index)
        this.setState({
            isLike: true
        })
    }

    render() {
        const { item, index } = this.props
        const { isLike } = this.state
        const genderShow = item['gender'] == 'M' ? "li male" : (item['gender'] == 'F' ? "li female" : "li");
        const taGenderShow = item['taGender'] == 'M' ? "li female" : (item['taGender'] == 'F' ? "li female" : "li");

        return (
            <View>
                <View className='post'>
                    <View className='post-title'>
                        <View className='ul'>
                            <Text className={genderShow}>
                                {item['nickname']}
                            </Text>
                            <AtIcon className='li' value='heart-2' size='20' color='#ef5350'></AtIcon>
                            <Text className={taGenderShow}>
                                {item['taName']}
                            </Text>
                        </View>
                    </View>
                    <View className='post-body'>
                        <Text className='post-body-content'>
                            <Text>{item['content']}</Text>
                        </Text>
                        <Text className='post-body-time'>
                            <Text>{item['createdAt']}</Text>
                        </Text>
                    </View>
                    <View className='post-actions'>
                        <View className='at-row'>
                            <View className='at-col' onClick={this.onHandleLike.bind(this, index)}>
                                <AtIcon value={isLike ? "heart-2" : "heart"} size='20' color='#ffb400'></AtIcon>
                                <Text>{item['like']}</Text>
                            </View>
                            <View className='at-col' onClick={this.onHandleStar.bind(this, index)}>
                                <AtIcon value='star' size='20' color='#ffb400'></AtIcon>
                                <Text className='star'>{item['guessRight']}/{item['guess']}</Text>
                            </View>
                            <View className='at-col'>
                                <View className='block'>
                                    <AtIcon value='share' size='20' color='#ffb400'></AtIcon>
                                    <Text className='share'>分享</Text>
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