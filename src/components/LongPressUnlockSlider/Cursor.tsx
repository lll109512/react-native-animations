import React, { useState } from 'react'
import { Easing, StyleSheet, Text, View } from 'react-native'
import { LongPressGestureHandler, PanGestureHandler, PanGestureHandlerGestureEvent, State, TapGestureHandler } from 'react-native-gesture-handler'
import Animated,{runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming,useAnimatedProps} from 'react-native-reanimated'
import {CIRCLE,PADDING} from './constants.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useRef } from 'react'

// const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign)
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
    // const [cursorActived, setCursorActived] = useState<boolean>(false)
    const rightSideMaxX = props.maxWidth - CIRCLE - PADDING * 2
    const contextX = useSharedValue<number>(0)
    const cursorActived = useSharedValue<boolean>(false)
    const onGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart:()=>{
            contextX.value = props.translateX.value
            // if(cursorActived.value){
            //     runOnJS(props.setIsDraging)(true)
            // }
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
        },
        // onFinish:()=>{
        //     runOnJS(props.setIsDraging)(false)
        // }
    })
    const inRangeX = useDerivedValue(()=>{
        return Math.min(Math.max(props.translateX.value,0),rightSideMaxX)
    })
    const style = useAnimatedStyle(()=>{
        return {
            transform:[{translateX:inRangeX.value}]
        }
    })
    const longPressHandlerRef = useRef(null)
    const panHandlerRef = useRef(null)
    return (
        <LongPressGestureHandler 
            ref={longPressHandlerRef}
            simultaneousHandlers={panHandlerRef}
            minDurationMs={500} 
            onHandlerStateChange={({ nativeEvent, }) => {
                if (nativeEvent.state === State.ACTIVE) {
                    console.log('long pressed')
                    cursorActived.value = true
                }
                if (nativeEvent.state === State.END) {
                    console.log('long pressed end')
                    cursorActived.value = false
                }
            }
        }>
            <View>
                <PanGestureHandler onGestureEvent={onGestureHandler} ref={panHandlerRef}>
                    <Animated.View style={[styles.root,style]}>
                        {/* <Text>Drag</Text> */}
                        <AntDesign name={props.iconName} size={30}/>
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </LongPressGestureHandler>
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
