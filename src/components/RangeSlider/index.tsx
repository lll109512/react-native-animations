import React from 'react'
import { useState,useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { LayoutRectangle } from 'react-native'
import sortBy from 'lodash/sortBy'
import { HEIGHT,PADDINGH } from './constants'
import Cursor from './Cursor'
import { useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { snapPoint } from 'react-native-redash'



interface Props {
    options: Array<{
        label: string,
        value: string | number
    }>,
}

const index: React.FC<Props> = (props) => {
    const {options} = props
    const [positions, setPositions] = useState<Array<LayoutRectangle>>([])
    const [maxWidth, setMaxWidth] = useState<number>(0)
    const snapPoints = positions.map((item,index)=> item.x - HEIGHT/2 + item.width /2)
    const widths = positions.map(item=> item.width)
    const CursorOneX = useSharedValue<number>(0)
    const CursorTwoX = useSharedValue<number>(0)
    
    useEffect(() => {
        if(maxWidth && snapPoint){
            CursorTwoX.value = snapPoint(maxWidth,0,snapPoints)
        }
    }, [maxWidth,snapPoint])

    const cursorOneLable = useDerivedValue(()=>{
        const value = snapPoint(CursorOneX.value,0,snapPoints)
        const index = snapPoints.findIndex(item=>item==value)
        return `${index!==undefined && options && options?.[index]?.label}`
    })
    const cursorTwoLable = useDerivedValue(()=>{
        const value = snapPoint(CursorTwoX.value,0,snapPoints)
        const index = snapPoints.findIndex(item=>item==value)
        return `${index!==undefined && options && options?.[index]?.label}`
    })
    return (
        <View>
            <View style={styles.root} onLayout={e=>setMaxWidth(e?.nativeEvent?.layout.width)}>
                <View style={styles.textRoot}>
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
                <Cursor label={cursorOneLable} x={CursorOneX} snapPoints={snapPoints} maxWidth={maxWidth}/>
                <Cursor label={cursorTwoLable} x={CursorTwoX} snapPoints={snapPoints} maxWidth={maxWidth}/>
            </View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    root:{
        width:"100%",
        height:HEIGHT,
        backgroundColor:"rgba(0,0,0,0.8)",
        borderRadius:HEIGHT/2,
        display:"flex",
        alignItems:'center',
        justifyContent:"center",
        flexDirection:'row',
        position:"relative"
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
    }
})