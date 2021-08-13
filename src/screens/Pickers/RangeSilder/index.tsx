import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import RangeSilder from 'src/components/RangeSlider'

const mockData = [
    {
        label:'0',
        value:0
    },
    {
        label:'1',
        value:1
    },
    {
        label:'2',
        value:2
    },
    {
        label:'3',
        value:3
    },
    {
        label:'4',
        value:4
    },
    {
        label:'5',
        value:5
    }
]

interface Props {
    
}


const index = (props: Props) => {
    return (
        <View style={styles.root}>
            <RangeSilder options={mockData}/>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    root:{
        flex:1,
        backgroundColor:'white',
        justifyContent:"center",
        padding:8
    }
})
