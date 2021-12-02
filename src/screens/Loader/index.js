import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {MotiView} from 'moti'

const LoadingIndicator = ({size})=>{
    return (
        <MotiView
            from={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 0,
                shadowOpacity: 0.6,
            }}
            animate={{
                width: size + 30,
                height: size + 30,
                borderRadius: (size + 30) / 2,
                borderWidth: size / 10,
                shadowOpacity: 1,
            }}
            transition={{
                type: "timing",
                duration: 1000,
                loop: true,
            }}
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: size / 10,
                borderColor: "white",
                shadowColor: "white",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 10,
            }}
        />
    );
}
const index = () => {
    return (
        <View style={styles.container}>
            <LoadingIndicator size={100}/>
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
