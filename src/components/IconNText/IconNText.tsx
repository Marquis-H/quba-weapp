import React, { Component } from 'react'
import { View } from '@tarojs/components'

export default class IconNText extends Component {
    render() {
        return (
            <View>
                { this.props.children}
            </View>
        )
    }
}