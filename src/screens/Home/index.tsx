import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
    
}

const index = (props: Props) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
            <Text>Hello</Text>
        </View>
    )
}

export default index

const styles = StyleSheet.create({})
