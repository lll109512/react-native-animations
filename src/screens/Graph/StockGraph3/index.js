import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler,PinchGestureHandler } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Chart from "./Chart";

import data from "./data.json";
import Label from "./Label";
import Line from "./Line";
import Values from "./Values";
// import Line from "./Line";
// import Content from "./Content";
// import Header from "./Header";

const { width: size } = Dimensions.get("window");
// const candles = data.slice(0, 20);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
});

export default () => {
    // const windowSize = 40
    // const [windowSize, setWindowSize] = useState(30);
    // const [candles, setCandles] = useState(data.slice(windowStartIndex, windowSize));
    // const values = candles.map(candle=>[candle.low,candle.high]).flat()
    // const domain = [Math.min(...values),Math.max(...values)]
    // const caliber = size / candles.length;
    const isActived = useSharedValue(false)
    // const hasTranslatedX = useSharedValue(0)
    // const windowStartIndex = useSharedValue(0);
    // const windowSize = useSharedValue(30);
    // const windowSize = useSharedValue(30);
    const caliber = useSharedValue(10);
    const scrollOffset = useSharedValue(0);
    const contextX = useSharedValue(0);
    // const center = useSharedValue(0);
    const onGestureHandler = useAnimatedGestureHandler({
        onStart() {
            isActived.value = true;
            contextX.value = scrollOffset.value
        },
        onActive(event) {
            scrollOffset.value = Math.min(contextX.value + event.translationX,0)
            // console.log(scrollOffset.value);
            // translateY.value = event.y;
            // translateX.value = event.translationX
            // const canTranslateX = event.translationX - hasTranslatedX.value
            // console.log(canTranslateX, event.translationX, hasTranslatedX.value);
            // if (Math.abs(canTranslateX) / caliber > 1) {
            //     if (canTranslateX > 0 && windowStartIndex.value >= 0) {
            //         const sliderDistance = Math.floor(Math.abs(canTranslateX) / caliber);
            //         const moveToStartIndex = Math.max(windowStartIndex.value - sliderDistance, 0);
            //         windowStartIndex.value = moveToStartIndex;
            //         hasTranslatedX.value = event.translationX;
            //     } else if (canTranslateX < 0 && windowStartIndex.value >= 0) {
            //         const sliderDistance = Math.floor(Math.abs(canTranslateX) / caliber);
            //             const moveToStartIndex = Math.min(
            //                 windowStartIndex.value + sliderDistance,
            //                 data.length - windowSize.value - 1
            //             );
            //             windowStartIndex.value = moveToStartIndex;
            //             hasTranslatedX.value = event.translationX;
            //     }
            // }
        },
        onFinish() {
            isActived.value = false;
            contextX.value = 0
            // hasTranslatedX.value = 0;
        },
    });

    const onPinchGestureHandler = useAnimatedGestureHandler({
        onActive(event){
            // windowSize.value = Math.min(Math.max(Math.floor(windowSize.value * 1/event.scale), 10), 50);
            // runOnJS(setCandles)(
            //     data.slice(windowStartIndex.value, windowStartIndex.value + windowSize.value)
            // );
        }
    })
    return (
        <View style={styles.container}>
            <View style={{ height: 100 }}>{/* <Values {...{ caliber, candles }} /> */}</View>
            <View>
                <Chart {...{ caliber, data, scrollOffset }} />
                <PanGestureHandler onGestureEvent={onGestureHandler}>
                    <Animated.View style={[StyleSheet.absoluteFill]}>
                        <PinchGestureHandler onGestureEvent={onPinchGestureHandler}>
                            <Animated.View style={[StyleSheet.absoluteFill]} />
                        </PinchGestureHandler>
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </View>
    );
};
