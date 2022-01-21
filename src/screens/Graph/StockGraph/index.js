import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Chart from "./Chart";

import data from "./data.json";
import Label from "./Label";
import Line from "./Line";
import Values from "./Values";
// import Line from "./Line";
// import Content from "./Content";
// import Header from "./Header";

const { width: size } = Dimensions.get("window");
const candles = data.slice(0, 20);
const values = candles.map(candle=>[candle.low,candle.high]).flat()
const domain = [Math.min(...values),Math.max(...values)]
const caliber = size / candles.length;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
});

export default () => {
    const isActived = useSharedValue(false)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const onGestureHandler = useAnimatedGestureHandler({
        onStart() {
            isActived.value = true;
        },
        onActive(event) {
            translateY.value = event.y;
            translateX.value = event.x;
        },
        onFinish() {
            isActived.value = false;
        },
    });
    const rHorizontalLineStyle = useAnimatedStyle(()=>{
        const tranY = Math.max(Math.min(translateY.value, size),0)
        return {
            opacity: isActived.value ? withTiming(1) : withTiming(0),
            transform: [{ translateY: tranY }],
        };
    })
    const rVerticalLineStyle = useAnimatedStyle(()=>{
        const tranX = Math.min(translateX.value, size)
        return {
            opacity: isActived.value ? withTiming(1) : withTiming(0),
            transform: [{ translateX: tranX }],
        };
    })
    return (
        <View style={styles.container}>
            <View>
                {/* <Header /> */}
                <Values {...{ caliber, candles, translateX }} />
            </View>
            <View>
                <Chart {...{ candles, size, domain, caliber }} />
                <PanGestureHandler minDist={0} onGestureEvent={onGestureHandler}>
                    <Animated.View style={[StyleSheet.absoluteFill]}>
                        <Animated.View
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
                        />
                    </Animated.View>
                </PanGestureHandler>
            </View>
            {/* <Content /> */}
        </View>
    );
};
