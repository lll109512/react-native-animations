import React from 'react'
import { Easing, StyleSheet, Text, View } from 'react-native'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated,{runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming} from 'react-native-reanimated'
import {CIRCLE,PADDING} from './constants.js'
import AntDesign from 'react-native-vector-icons/AntDesign'

interface Props {
    iconName: string,
    translateX: Animated.SharedValue<number>,
    maxWidth: number,
    setIsDraging: Function,
    threshHold:number,
    onOpen:Function,
    onClose:Function
}

const Cursor = (props: Props) => {
    const rightSideMaxX = props.maxWidth - CIRCLE - PADDING * 2
    const contextX = useSharedValue<number>(0)
    const onGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart:()=>{
            contextX.value = props.translateX.value
            runOnJS(props.setIsDraging)(true)
        },
        onActive:({translationX,x})=>{
            props.translateX.value = translationX + contextX.value
        },
        onEnd:({velocityX,translationX})=>{
            if(props.translateX.value >= rightSideMaxX * props.threshHold){
                props.translateX.value = withTiming(rightSideMaxX)
                runOnJS(props.onOpen)()
            }else{
                props.translateX.value = withTiming(0)
                runOnJS(props.onClose)()
            }
        },
        onFinish:()=>{
            runOnJS(props.setIsDraging)(false)
        }
    })
    const inRangeX = useDerivedValue(()=>{
        return Math.min(Math.max(props.translateX.value,0),rightSideMaxX)
    })
    const style = useAnimatedStyle(()=>{
        return {
            transform:[{translateX:inRangeX.value}]
        }
    })
    return (
         <PanGestureHandler onGestureEvent={onGestureHandler}>
            <Animated.View style={[styles.root,style]}>
                <Text>Drag</Text>
            </Animated.View>
         </PanGestureHandler>
    )
}

export default Cursor

const styles = StyleSheet.create({
    root:{
        height:CIRCLE,
        width:CIRCLE,
        backgroundColor:"white",
        // opacity:0.5,
        borderRadius:CIRCLE/2,
        // position:"absolute",
        alignItems:'center',
        justifyContent:"center",
        // left:0,
    }
})
