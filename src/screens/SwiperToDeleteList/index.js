import React, { useRef, useState } from 'react'
import {  StyleSheet, Text, View,Dimensions } from 'react-native'
import Animated,{Extrapolate, interpolate, runOnJS, spring, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming} from 'react-native-reanimated'
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
const screen = Dimensions.get('screen')
const screenWidth = screen.width
const deleteThreshold = 0.4

const AnimatedIcons = Animated.createAnimatedComponent(Ionicons)
const Item = (props) =>{
    const { index,title, scrollViewRef,onDelete } = props;
    const contextX = useSharedValue(0)
    const translateX = useSharedValue(0)
    const deleted = useSharedValue(false)
    const onGestureHandler = useAnimatedGestureHandler({
        onStart: () => {
            contextX.value = translateX.value;
        },
        onActive: ({ translationX, x }) => {
            translateX.value = Math.min(translationX + contextX.value,0)
        },
        onEnd: () => {
            if(translateX.value < - screenWidth*deleteThreshold){
                translateX.value = withTiming(-screenWidth)
                deleted.value = true
            }else{
                translateX.value = withTiming(0);
            }
        }
    });

    const height = useDerivedValue(()=>{
        if(deleted.value === true){
            return withTiming(0,{},()=>{
                runOnJS(onDelete)(index);
            })
        }else{
            return 50
        }
    })

    const rStyle = useAnimatedStyle(()=>{
        return {
            transform: [{ translateX: translateX.value}],
            height:height.value
        };
    })
    const rContainerStyle = useAnimatedStyle(()=>{
        return {
            height:height.value
        };
    })
    const iconStyle = useAnimatedStyle(()=>{
        const norm = interpolate(
            translateX.value,
            [0, -screenWidth * deleteThreshold],
            [0, 1],
            Extrapolate.CLAMP
        );
        const opacity = interpolate(translateX.value,[0,-screenWidth*deleteThreshold],[0,1],Extrapolate.CLAMP)
        return {
            marginRight: 12 + norm * 12,
            opacity: opacity,
        };
    })
    return (
        <Animated.View style={[styles.itemBg, rContainerStyle]}>
            <View style={styles.itemBack}>
                <AnimatedIcons
                    style={[iconStyle]}
                    size={24}
                    name={"trash-outline"}
                    color={"white"}
                />
            </View>
            <PanGestureHandler
                onGestureEvent={onGestureHandler}
                simultaneousHandlers={[scrollViewRef]}
            >
                <Animated.View style={[styles.item, rStyle]}>
                    <Text>{title}</Text>
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    );
}

const index = (props) => {
    const scrollViewRef = useRef(null)
    const [data, setData] = useState(Array(30)
            .fill(0)
            .map((_, index) => index)
    );
    const onDelete = (index)=>{
        setData(c=>{
            c.splice(index,1)
            return c
        })
    }

    return (
        <View style={styles.root}>
            <ScrollView ref={scrollViewRef} style={styles.root}>
                {data.map((item, i) => (
                    <Item title={item} scrollViewRef={scrollViewRef} onDelete={()=>onDelete(i)} />
                ))}
            </ScrollView>
        </View>
    );
}

export default index

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",
    },
    item: {
        backgroundColor: "white",
        alignContent: "center",
        justifyContent: "center",
        width: "100%",
        height: 50,
        paddingHorizontal: 12,
        // paddingVertical:8
    },
    itemBg: {
        height: 50,
        backgroundColor: "red",
        position:"relative"
    },
    itemBack:{
        ...StyleSheet.absoluteFillObject,
        flexDirection:"row",
        justifyContent:"flex-end",
        alignItems:"center"
        // backgroundColor:"green"
    }
});
