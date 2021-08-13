import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { HEIGHT,PADDINGH } from './constants'
import Animated,{useAnimatedStyle,useDerivedValue,withTiming,useSharedValue,useAnimatedGestureHandler, runOnJS} from 'react-native-reanimated'
import {PanGestureHandler, PanGestureHandlerEventPayload, PanGestureHandlerGestureEvent} from 'react-native-gesture-handler'
import { snapPoint,ReText } from 'react-native-redash'

interface Props {
    label: Animated.SharedValue<string>,
    x: Animated.SharedValue<number>,
    snapPoints: Array<number>,
    maxWidth: number,
    onMoveEnd:Function
}

const Cursor: React.FC<Props> = (props) => {
    const {label,snapPoints,maxWidth,onMoveEnd} = props
    const contextX = useSharedValue<number>(0)
    const onGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart:(_)=>{
            contextX.value = props.x.value
        },
        onActive:({translationX,x})=>{
            props.x.value = translationX + contextX.value
        },
        onEnd:({velocityX})=>{
            props.x.value = withTiming(snapPoint(props.x.value,0,snapPoints),{},(isFinished)=>{
                if(isFinished){
                    runOnJS(onMoveEnd)()
                }
            })
            contextX.value = Math.min(Math.max(props.x.value,0),maxWidth - HEIGHT)
        }
    })
    const inRangeX = useDerivedValue(()=>{
        return Math.min(Math.max(props.x.value,0),maxWidth - HEIGHT)
    })
    const style = useAnimatedStyle(()=>{
        return {
            transform:[{translateX:inRangeX.value}]
        }
    })
    return (
        <PanGestureHandler onGestureEvent={onGestureHandler}>
            <Animated.View style={[styles.root,style]}>
                <ReText style={styles.text} text={label}/>
            </Animated.View>
        </PanGestureHandler>
    )
}

export default Cursor

const styles = StyleSheet.create({
    root:{
        height:HEIGHT,
        width:HEIGHT,
        backgroundColor:"white",
        // opacity:0.5,
        borderRadius:HEIGHT,
        position:"absolute",
        alignItems:'center',
        justifyContent:"center",
        left:0,
    },
    text:{
        color:'rgba(0,0,0,0.8)',
        fontSize:20,
        fontWeight:"500"
    }
})
