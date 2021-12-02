import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const index = () => {
    return (
        <View style={styles.container}>
            <Text></Text>
        </View>
    );
}

export default index

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black',
        alignItems:"center",
        justifyContent:"center"
    }
})
