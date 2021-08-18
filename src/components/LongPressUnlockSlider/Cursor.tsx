import React, { useState } from 'react'
import { Easing, StyleSheet, Text, View } from 'react-native'
import { LongPressGestureHandler, PanGestureHandler, PanGestureHandlerGestureEvent, State, TapGestureHandler } from 'react-native-gesture-handler'
import Animated,{runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming,useAnimatedProps, interpolate, Extrapolate} from 'react-native-reanimated'
import {CIRCLE,PADDING} from './constants.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useRef } from 'react'
import { mixColor } from 'react-native-redash'
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
    const cursorActived = useSharedValue<boolean>(false)
    const pressedDuration = useSharedValue<number>(0)
    let timer:NodeJS.Timer
    const onGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart:()=>{
            contextX.value = props.translateX.value
        },
        onActive:({translationX,x})=>{
            if(cursorActived.value){
                props.translateX.value = translationX + contextX.value
            }
        },
        onEnd:()=>{
            if(props.translateX.value >= rightSideMaxX * props.threshHold){
                props.translateX.value = withTiming(rightSideMaxX)
                runOnJS(props.onOpen)()
            }else{
                props.translateX.value = withTiming(0)
                runOnJS(props.onClose)()
            }
             cursorActived.value = false
        },
    })
    const inRangeX = useDerivedValue(()=>{
        return Math.min(Math.max(props.translateX.value,0),rightSideMaxX)
    })
    const style = useAnimatedStyle(()=>{
        const normValue = interpolate(pressedDuration.value,[0,1000],[0,1],Extrapolate.CLAMP)
        const color = mixColor(normValue, '#fff', '#24b322')
        return {
            transform:[{translateX:inRangeX.value}],
            borderColor:color
        }
    })
    const longPressHandlerRef = useRef(null)
    const panHandlerRef = useRef(null)

    return (
        <TapGestureHandler 
            ref={longPressHandlerRef}
            simultaneousHandlers={panHandlerRef}
            onHandlerStateChange={({ nativeEvent, }) => {
                if (nativeEvent.state === State.BEGAN) {
                    console.log('long pressed begined')
                    timer = setInterval(()=>{
                        if(pressedDuration.value >= 1000){
                            clearInterval(timer)
                            cursorActived.value = true
                        }
                        pressedDuration.value = withTiming(500 + pressedDuration.value,{duration:500})
                    },500)
                }
                if (nativeEvent.state === State.END) {
                    console.log('long pressed end')
                    clearInterval(timer)
                    pressedDuration.value = withTiming(0)
                }
            }
        }>
            <View style={{width:CIRCLE}}>
                <PanGestureHandler onGestureEvent={onGestureHandler} ref={panHandlerRef}>
                    <Animated.View style={[styles.root,style]}>
                        <AntDesign name={props.iconName} size={30}/>
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </TapGestureHandler>
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
        borderColor:"#fff",
        borderWidth:3,
        // left:0,
    }
})
