import React,{useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue,interpolateColors } from 'react-native-reanimated'
import { mixColor } from 'react-native-redash'
import {HEIGHT,CIRCLE,UNLOCK_COLOR,LOCKED_COLOR,PADDING} from './constants.js'
import Cursor from './Cursor'

interface Props {
    open: boolean,
    setOpen:Function
}

const index = (props: Props) => {
    const { open,setOpen } = props
    const [maxWidth, setMaxWidth] = useState<number>(0)
    const [isDraging, setIsDraging] = useState<boolean>(false)
    const translateX = useSharedValue(0)
    const onOpen = ()=>{
       setOpen(true) 
    }
    const onClose = ()=>{
       setOpen(false) 
    }

    const backgroundColor = useDerivedValue(() => {
        const normValue = interpolate(translateX.value,[0,maxWidth - CIRCLE - PADDING*2],[0,1])
        return mixColor(normValue, LOCKED_COLOR, UNLOCK_COLOR)
    });
    
    const astyle = useAnimatedStyle(()=>{
        return {
            backgroundColor:backgroundColor.value,
        }
    })

    return (
        <View>
            <Animated.View style={[styles.bar,astyle]} onLayout={(e)=>setMaxWidth(e.nativeEvent.layout.width)}>
                <View style={[styles.backTextView,StyleSheet.absoluteFillObject]}>
                    {!isDraging &&
                    <Text style={styles.backText}>{open?'Unlocked':'Locked'}</Text>
                    }
                </View>
                <Cursor maxWidth={maxWidth} translateX={translateX} iconName={open?'unlock':'lock1'} setIsDraging={setIsDraging} threshHold={0.8} onOpen={onOpen} onClose={onClose}/>
            </Animated.View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    bar:{
        height:HEIGHT,
        width:"100%",
        backgroundColor:"black",
        borderRadius:HEIGHT/2,
        justifyContent:"center",
        paddingHorizontal:PADDING,
        position:"relative"
    },
    backTextView:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    backText:{
        color:'white',
        fontSize:20,
        textTransform:"uppercase"
    }
})
