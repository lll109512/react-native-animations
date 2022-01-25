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
    const [candles, setCandles] = useState(data.slice(windowStartIndex, windowSize));
    const values = candles.map(candle=>[candle.low,candle.high]).flat()
    const domain = [Math.min(...values),Math.max(...values)]
    const caliber = size / candles.length;
    const isActived = useSharedValue(false)
    const hasTranslatedX = useSharedValue(0)
    const windowStartIndex = useSharedValue(0);
    const windowSize = useSharedValue(30);
    console.log('redraw')
    const onGestureHandler = useAnimatedGestureHandler({
        onStart() {
            isActived.value = true;
        },
        onActive(event) {
            // translateY.value = event.y;
            // translateX.value = event.translationX
            const canTranslateX = event.translationX - hasTranslatedX.value
            // console.log(canTranslateX, event.translationX, hasTranslatedX.value);
            if (Math.abs(canTranslateX) / caliber > 1) {
                if (canTranslateX > 0 && windowStartIndex.value >= 0) {
                    const sliderDistance = Math.floor(Math.abs(canTranslateX) / caliber);
                    const moveToStartIndex = Math.max(windowStartIndex.value - sliderDistance, 0);
                    windowStartIndex.value = moveToStartIndex;
                    runOnJS(setCandles)(
                        data.slice(moveToStartIndex, moveToStartIndex + windowSize.value)
                    );
                    hasTranslatedX.value = event.translationX;
                } else if (canTranslateX < 0 && windowStartIndex.value >= 0) {
                    const sliderDistance = Math.floor(Math.abs(canTranslateX) / caliber);
                        const moveToStartIndex = Math.min(
                            windowStartIndex.value + sliderDistance,
                            data.length - windowSize.value - 1
                        );
                        windowStartIndex.value = moveToStartIndex;
                        runOnJS(setCandles)(
                            data.slice(moveToStartIndex, moveToStartIndex + windowSize.value)
                        );
                        hasTranslatedX.value = event.translationX;
                }
                // if (canTranslateX > 0 && windowStartIndex.value + 20 <= data.length - 1) {
                //     const sliderDistance = Math.floor(canTranslateX / caliber);
                //     const moveToStartIndex = Math.min(
                //         windowStartIndex.value + sliderDistance,
                //         data.length - windowSize.value - 1
                //     );
                //     windowStartIndex.value = moveToStartIndex;
                //     runOnJS(setCandles)(
                //         data.slice(moveToStartIndex, moveToStartIndex + windowSize.value)
                //     );
                //     hasTranslatedX.value = event.translationX;
                // } else if (canTranslateX < 0 && windowStartIndex.value >= 0) {
                //     const sliderDistance = Math.floor(Math.abs(canTranslateX) / caliber);
                //     const moveToStartIndex = Math.max(windowStartIndex.value - sliderDistance, 0);
                //     windowStartIndex.value = moveToStartIndex;
                //     runOnJS(setCandles)(
                //         data.slice(moveToStartIndex, moveToStartIndex + windowSize.value)
                //     );
                //     hasTranslatedX.value = event.translationX;
                // }
            }
        },
        onFinish() {
            isActived.value = false;
            hasTranslatedX.value = 0;
        },
    });

    const onPinchGestureHandler = useAnimatedGestureHandler({
        onActive(event){
            // console.log(event.scale);
            // if (event.scale>1.1||event.scale<0.9)
            windowSize.value = Math.min(Math.max(Math.floor(windowSize.value * 1/event.scale), 10), 50);
            runOnJS(setCandles)(
                data.slice(windowStartIndex.value, windowStartIndex.value + windowSize.value)
            );
        }
    })
    // const rHorizontalLineStyle = useAnimatedStyle(()=>{
    //     const tranY = Math.max(Math.min(translateY.value, size),0)
    //     return {
    //         opacity: isActived.value ? withTiming(1) : withTiming(0),
    //         transform: [{ translateY: tranY }],
    //     };
    // })
    // const rVerticalLineStyle = useAnimatedStyle(()=>{
    //     const tranX = Math.min(translateX.value, size)
    //     return {
    //         opacity: isActived.value ? withTiming(1) : withTiming(0),
    //         transform: [{ translateX: tranX }],
    //     };
    // })
    return (
        <View style={styles.container}>
            <View>
                {/* <Header /> */}
                <Values {...{ caliber, candles }} />
            </View>
            <View>
                <Chart {...{ candles, size, domain, caliber }} />
                <PanGestureHandler minDist={2} onGestureEvent={onGestureHandler}>
                    <Animated.View style={[StyleSheet.absoluteFill]}>
                        <PinchGestureHandler onGestureEvent={onPinchGestureHandler}>
                            <Animated.View style={[StyleSheet.absoluteFill]} />
                        </PinchGestureHandler>
                        {/* <Animated.View
                            style={[StyleSheet.absoluteFillObject, rHorizontalLineStyle]}
                        >
                            <Line x={size} y={0} />
                        </Animated.View>
                        <Animated.View style={[StyleSheet.absoluteFillObject, rVerticalLineStyle]}>
                            <Line x={0} y={size} />
                        </Animated.View>
                        <Label
                            translateY={translateY}
                            domain={domain}
                            size={size}
                            isActived={isActived}
                        /> */}
                    </Animated.View>
                </PanGestureHandler>
            </View>
            {/* <Content /> */}
        </View>
    );
};
