import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import Animated,{useAnimatedScrollHandler, useAnimatedStyle, useSharedValue,interpolate, Extrapolate} from 'react-native-reanimated';
import {images} from 'src/data/data'
const AnimatedScrollHeader = (props) => {
    const offsetY = useSharedValue(0)
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: ({ contentOffset: { y } }) => {
            console.log(y)
            offsetY.value = y
        }
    })

    const headerStyle = useAnimatedStyle(()=>{
        const height = interpolate(offsetY.value,[0,100],[300,100],Extrapolate.CLAMP)
        const scale = interpolate(offsetY.value, [-100, 0], [1.4, 1], Extrapolate.CLAMP);
        return {
            height: height,
            transform: [{ scale },],
        };
    })
    const coverStyle = useAnimatedStyle(()=>{
        const opacity = interpolate(offsetY.value,[0,100],[0.2,0.7],Extrapolate.CLAMP)
        return {
            opacity: opacity,
        };
    })

    const textViewStyle = useAnimatedStyle(()=>{
        const translateY = interpolate(offsetY.value,[50,100],[40,0],Extrapolate.CLAMP)
        const opacity = interpolate(offsetY.value,[50,100],[0,1],Extrapolate.CLAMP)
        return {
            transform: [{ translateY }],
            opacity,
        };
    })

    return (
        <View style={{ flex: 1 }}>
            <Animated.View
                style={[
                    {
                        height: 300,
                        position: "relative",
                    },
                    headerStyle,
                ]}
            >
                <Image
                    source={{ uri: images[0].image }}
                    style={[
                        StyleSheet.absoluteFillObject,
                        {
                            resizeMode: "cover",
                            width: "150%",
                            height: "150%",
                            transform: [{ translateX: -100 }],
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        { backgroundColor: "black", flex: 1 },
                        coverStyle,
                    ]}
                ></Animated.View>
                <Animated.View style={[textViewStyle]}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            textAlign: "center",
                            width: "100%",
                            marginTop: 50,
                        }}
                    >
                        {"Animation"}
                    </Text>
                </Animated.View>
            </Animated.View>
            <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
                <View>
                    <View style={{ backgroundColor: "red", height: 100, padding: 12 }}></View>
                    <View style={{ backgroundColor: "blue", height: 200, padding: 12 }}></View>
                    <View style={{ backgroundColor: "orange", height: 100, padding: 12 }}></View>
                    <View style={{ backgroundColor: "red", height: 400, padding: 12 }}></View>
                    <View style={{ backgroundColor: "blue", height: 100, padding: 12 }}></View>
                    <View style={{ backgroundColor: "orange", height: 200, padding: 12 }}></View>
                    <View style={{ backgroundColor: "red", height: 100, padding: 12 }}></View>
                    <View style={{ backgroundColor: "blue", height: 100, padding: 12 }}></View>
                    <View style={{ backgroundColor: "orange", height: 300, padding: 12 }}></View>
                    <View style={{ backgroundColor: "red", height: 100, padding: 12 }}></View>
                    <View style={{ backgroundColor: "blue", height: 200, padding: 12 }}></View>
                    <View style={{ backgroundColor: "orange", height: 100, padding: 12 }}></View>
                </View>
            </Animated.ScrollView>
        </View>
    );
}

export default AnimatedScrollHeader;

const styles = StyleSheet.create({})
