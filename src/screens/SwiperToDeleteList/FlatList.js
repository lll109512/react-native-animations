import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View, Dimensions,Animated as RNAnimated } from "react-native";
import Animated,{Extrapolate, interpolate, runOnJS, spring, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming} from 'react-native-reanimated'
import { PanGestureHandler, ScrollView, FlatList } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Ionicons from "react-native-vector-icons/Ionicons";
const screen = Dimensions.get('screen')
const screenWidth = screen.width
const deleteThreshold = 0.4
// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
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

    const RenderRightItem = (progress, dragX) => {
        const norm = progress.interpolate({
            inputRange:[0,1],
            outputRange:[0,-12],
        })
        const opacity = progress.interpolate({
            inputRange:[0,1],
            outputRange:[0,1],
        })
        return (
            <RNAnimated.View style={[styles.itemBg]}>
                <RNAnimated.View style={{ transform: [{ translateX: norm }], opacity: opacity }}>
                    <Ionicons
                        style={{ marginRight: 12 }}
                        size={24}
                        name={"trash-outline"}
                        color={"white"}
                    />
                </RNAnimated.View>
            </RNAnimated.View>
        ); 
    };

    return (
        <Swipeable renderRightActions={RenderRightItem}>
            <View style={styles.item}>
                <Text>{title}</Text>
            </View>
        </Swipeable>
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
            <FlatList
                keyExtractor={(item, index) => item.toString()}
                data={data}
                ref={scrollViewRef}
                style={styles.root}
                renderItem={({ item, index }) => {
                    return (
                        <Item
                            title={item}
                            scrollViewRef={scrollViewRef}
                            onDelete={() => onDelete(index)}
                        />
                    );
                }}
            />
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
        width: screenWidth,
        // width: screenWidth*deleteThreshold,
        backgroundColor: "red",
        position: "relative",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    itemBack: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
});
