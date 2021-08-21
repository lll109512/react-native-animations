import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image,Dimensions } from 'react-native'
import Animated,{useAnimatedScrollHandler, useAnimatedStyle, useSharedValue,interpolate, Extrapolate} from 'react-native-reanimated';
import {images} from 'src/data/data'

const {height,width} = Dimensions.get('screen')

const AnimatedScrollHeader = (props) => {
    const offsetY = useSharedValue(0)
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: ({ contentOffset: { y } }) => {
            console.log(y)
            offsetY.value = y
        }
    })

    const headerStyle = useAnimatedStyle(()=>{
        const height = interpolate(offsetY.value,[0,100],[250,110],Extrapolate.CLAMP)
        return {
            height: height,
        };
    })
    const coverStyle = useAnimatedStyle(()=>{
        const opacity = interpolate(offsetY.value,[0,100],[0,0.7],Extrapolate.CLAMP)
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

    const imageStyle = useAnimatedStyle(()=>{
        const scale = interpolate(offsetY.value, [0, 100], [1.2,1], Extrapolate.CLAMP);
        return {
            transform:[{scale}]
        };
    })

    return (
        <View style={{ flex: 1 }}>
            <Animated.ScrollView
                style={{
                    borderTopRightRadius: 16,
                    borderTopLeftRadius: 16,
                    transform: [{ translateY: -16 }],
                    marginBottom: -16,
                }}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View>
                    <Animated.View
                        style={[
                            {
                                height: 250,
                                overflow: "hidden",
                                borderBottomLeftRadius: 16,
                                borderBottomRightRadius: 16,
                            },
                            headerStyle,
                        ]}
                    >
                        <View style={[StyleSheet.absoluteFillObject]}>
                            <Animated.View
                                style={[
                                    imageStyle,
                                    {
                                        width: "120%",
                                        height: "120%",
                                    },
                                ]}
                            >
                                <Image
                                    source={{ uri: images[0].image }}
                                    style={[
                                        StyleSheet.absoluteFillObject,
                                        {
                                            resizeMode: "cover",
                                            marginTop: -100,
                                        },
                                    ]}
                                />
                            </Animated.View>
                            <Animated.View
                                style={[
                                    StyleSheet.absoluteFillObject,
                                    { backgroundColor: "black" },
                                    coverStyle,
                                ]}
                            />
                        </View>
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
                                    marginTop: 70,
                                }}
                            >
                                {"Animation"}
                            </Text>
                        </Animated.View>
                    </Animated.View>
                </View>
                <View style={{transform:[{translateY:-16}],marginBottom:-16}}>
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
