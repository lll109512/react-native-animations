import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler,PinchGestureHandler } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Chart from "./Chart";

import data from "./data.json";


const { width } = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
});

export default () => {
    const isActived = useSharedValue(false)
    const caliber = 10
    const scrollOffset = useSharedValue(0);
    const contextX = useSharedValue(0);
    const scaleX = useSharedValue(1)
    const scaleContextX = useSharedValue(0)
    const focalX = useSharedValue(0)
    const onGestureHandler = useAnimatedGestureHandler({
        onStart() {
            isActived.value = true;
            contextX.value = scrollOffset.value
        },
        onActive(event) {
            scrollOffset.value = Math.min(contextX.value + event.translationX,0)
        },
        onFinish() {
            isActived.value = false;
            contextX.value = 0
        },
    });

    const onPinchGestureHandler = useAnimatedGestureHandler({
        onStart(event){
            scaleContextX.value = scaleX.value
            contextX.value = scrollOffset.value;
            focalX.value = event.focalX
        },
        onActive(event){
            const unlimitScaleX = scaleContextX.value * event.scale;
            if (unlimitScaleX <= 2 && 0.1 <= unlimitScaleX) {
                scaleX.value = Math.min(Math.max(unlimitScaleX, 0.1), 2);
                const caliberWidth = scaleX.value * caliber;
                const focalNumberOfCaliber =
                    Math.abs(contextX.value) / caliberWidth + focalX.value / caliberWidth;
                scrollOffset.value = Math.min(
                    contextX.value - focalNumberOfCaliber * caliberWidth * (event.scale - 1),
                    0
                );
                // console.log(
                //     scrollOffset.value,
                //     scaleX.value,
                //     focalNumberOfCaliber,r
                //     caliberWidth,
                //     event.scale - 1,
                //     focalNumberOfCaliber * caliberWidth * (event.scale - 1),
                // );
            }
        },
        onFinish() {
            scaleContextX.value = 0;
            contextX.value = 0;
            focalX.value = 0
        },
    })
    return (
        <View style={styles.container}>
            <View style={{ height: 100 }}>{/* <Values {...{ caliber, candles }} /> */}</View>
            <View>
                <Chart {...{ caliber, data, scrollOffset, scaleX }} />
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
