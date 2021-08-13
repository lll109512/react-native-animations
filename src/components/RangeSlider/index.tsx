import React from 'react'
import { useState,useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { LayoutRectangle } from 'react-native'
import sortBy from 'lodash/sortBy'
import { HEIGHT,PADDINGH } from './constants'
import Cursor from './Cursor'
import Animated,{ useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { snapPoint } from 'react-native-redash'
import { findIndex } from 'lodash'



interface Props {
    options: Array<{
        label: string,
        value: number
    }>,
    initValues?:{
        min: number,
        max: number
    },
    onChange: Function
}

const index: React.FC<Props> = (props) => {
    const {options,initValues,onChange} = props
    const [positions, setPositions] = useState<Array<LayoutRectangle>>([])
    const [maxWidth, setMaxWidth] = useState<number>(0)
    const [isInit, setIsInit] = useState<boolean>(false)
    const snapPoints = positions.map((item)=> item.x - HEIGHT/2 + item.width /2)
    const widths = positions.map(item=> item.width)
    const CursorOneX = useSharedValue<number>(0)
    const CursorTwoX = useSharedValue<number>(0)
    
    useEffect(() => {
        if(maxWidth && snapPoints && snapPoints.length === options.length && initValues){
            if(!isInit){
                if(initValues?.min){
                    CursorOneX.value = snapPoints[findIndex(options,{value:Math.min(initValues.min,initValues.max)})]
                }else{
                    CursorOneX.value = snapPoint(0,0,snapPoints)
                }
                if(initValues?.max){
                    CursorTwoX.value = snapPoints[findIndex(options,{value:Math.max(initValues.min,initValues.max)})]
                }else{
                    CursorTwoX.value = snapPoint(maxWidth,0,snapPoints)
                }
                setIsInit(true)
            }

        }
    }, [maxWidth,snapPoints,initValues])

    useEffect(() => {
        if(maxWidth && snapPoints && initValues){
            if(CursorOneX.value > CursorTwoX.value){
                CursorOneX.value = withTiming(snapPoints[findIndex(options,{value:Math.max(initValues.min,initValues.max)})])
                CursorTwoX.value = withTiming(snapPoints[findIndex(options,{value:Math.min(initValues.min,initValues.max)})])
            }else{
                CursorOneX.value = withTiming(snapPoints[findIndex(options,{value:Math.min(initValues.min,initValues.max)})])
                CursorTwoX.value = withTiming(snapPoints[findIndex(options,{value:Math.max(initValues.min,initValues.max)})])
            }

        }
    }, [initValues])

    const cursorOneLabel = useDerivedValue(()=>{
        const value = snapPoint(CursorOneX.value,0,snapPoints)
        const index = snapPoints.findIndex(item=>item==value)
        return `${index!==undefined && options && options?.[index]?.label}`
    })
    const cursorTwoLabel = useDerivedValue(()=>{
        const value = snapPoint(CursorTwoX.value,0,snapPoints)
        const index = snapPoints.findIndex(item=>item==value)
        return `${index!==undefined && options && options?.[index]?.label}`
    })
    const barStyle = useAnimatedStyle(()=>{
        return {
            transform:[{translateX:Math.min(CursorOneX.value,CursorTwoX.value,)+HEIGHT/2}],
            width:Math.max(CursorOneX.value-CursorTwoX.value,CursorTwoX.value-CursorOneX.value),
        }
    })

    const onCursorAnimatedEnd = ()=>{
        const valueOne = snapPoint(CursorOneX.value,0,snapPoints)
        const indexOne = snapPoints.findIndex(item=>item==valueOne)

        const valueTwo = snapPoint(CursorTwoX.value,0,snapPoints)
        const indexTwo = snapPoints.findIndex(item=>item==valueTwo)
        onChange({
            min:Math.min(options?.[indexOne]?.value, options?.[indexTwo]?.value),
            max:Math.max(options?.[indexOne]?.value, options?.[indexTwo]?.value),
        })
    }

    return (
        <View>
            <View style={styles.root} onLayout={e=>setMaxWidth(e?.nativeEvent?.layout.width)}>
                <View style={styles.textRoot}>
                    <Animated.View style={[styles.bar,barStyle]}/>
                    {options.map(({label},index)=>
                    <Text key={index} style={[styles.text]} onLayout={(e)=>{
                        if(e && e.nativeEvent && e.nativeEvent.layout){
                            setPositions(sortBy([...positions,e.nativeEvent.layout],'x'))
                        }
                    }}>
                        {label}
                    </Text>
                    )}
                </View>
                <Cursor label={cursorOneLabel} x={CursorOneX} snapPoints={snapPoints} maxWidth={maxWidth} onMoveEnd={onCursorAnimatedEnd}/>
                <Cursor label={cursorTwoLabel} x={CursorTwoX} snapPoints={snapPoints} maxWidth={maxWidth} onMoveEnd={onCursorAnimatedEnd}/>
            </View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    root:{
        width:"100%",
        height:HEIGHT,
        backgroundColor:"rgba(0,0,0,0.3)",
        borderRadius:HEIGHT/2,
        display:"flex",
        alignItems:'center',
        justifyContent:"center",
        flexDirection:'row',
        position:"relative",
        overflow:'hidden'
    },
    textRoot:{
        width:"100%",
        alignItems:'center',
        justifyContent:"space-between",
        flexDirection:'row',
        paddingHorizontal:PADDINGH,
    },
    text:{
        color:"white",
        fontSize:20,
        fontWeight:"500"
    },
    bar:{
        backgroundColor:"rgba(0,0,0,0.8)",
        height:HEIGHT,
        position:"absolute",
        left:0,
        // width:50
    }
})