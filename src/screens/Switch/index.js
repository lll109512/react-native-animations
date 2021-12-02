import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { MotiView } from 'moti'
import { Easing } from 'react-native-reanimated'

const COLORS = {
    active:'#2c2c2c',
    inactive:'#DCDCDC'
}

const transition = {
    type:'timing',
    duration:300,
    easing:Easing.inOut(Easing.ease)
}

const Switch = ({size,onPress,isActive=true})=>{
    const trackWidth = React.useMemo(()=>{
        return size * 1.5
    },[size])
    const trackHeight = React.useMemo(()=>{
        return size * 0.4
    },[size])
    const knobSize = React.useMemo(()=>{
        return size * 0.6
    },[size])
    return (
        <Pressable onPress={onPress}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <MotiView
                    style={{
                        position: "absolute",
                        width: trackWidth,
                        height: trackHeight,
                        borderRadius: trackHeight / 2,
                    }}
                    animate={{
                        backgroundColor: isActive ? COLORS.active : COLORS.inactive,
                    }}
                    transition={transition}
                />
                <MotiView
                    transition={transition}
                    animate={{
                        translateX: isActive ? trackWidth / 4 : -trackWidth / 4,
                    }}
                    style={{
                        width: size,
                        borderRadius: size / 2,
                        backgroundColor: "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MotiView
                        transition={transition}
                        style={{
                            width: knobSize,
                            height: knobSize,
                            borderRadius: knobSize / 2,
                            borderWidth: size * 0.1,
                            borderColor: COLORS.active,
                        }}
                        animate={{
                            borderColor: isActive ? COLORS.active : COLORS.inactive,
                            width: isActive ? knobSize : 0,
                        }}
                    />
                </MotiView>
            </View>
        </Pressable>
    );
}

const index = () => {
    const [isActive, setIsActive] = useState(false)
    return (
        <View style={styles.container}>
            <Switch size={60} isActive={isActive} onPress={() => setIsActive(c => !c)} />
        </View>
    );
}

export default index

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:"center",
        backgroundColor:"white"
    }
})
