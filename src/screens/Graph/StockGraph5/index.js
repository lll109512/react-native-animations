import React, { useEffect, useState, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LongPressGestureHandler, PanGestureHandler,PinchGestureHandler } from "react-native-gesture-handler";
import Chart from "./Chart";

import data from "./data.json";
import Svg, { G, Path } from 'react-native-svg';
import Candle from './Candle';
import { scaleLinear } from "d3-scale";
import Animated,{ interpolate, useAnimatedProps, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { line, area, curveCardinal } from "d3-shape";
import Label from "./Label";
import Line from "./Line";
const MARGIN = 2

const AnimatedG = Animated.createAnimatedComponent(G)


const screen = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
});

const height = screen.width
const width = screen.width
export default () => {
    const isActived = useSharedValue(false);
    const caliber = 10;
    const scrollOffset = useSharedValue(0);
    const contextX = useSharedValue(0);
    const scaleX = useSharedValue(1);
    const scaleContextX = useSharedValue(0);
    const focalX = useSharedValue(0);

    const lineTranslateX = useSharedValue(0);
    const lineTranslateY = useSharedValue(0);

    const inputRange = useSharedValue([7505.65, 8453.31]);
    const startEndRange = useSharedValue([0, Math.floor(width / caliber) + 1]);
    const maxMinArrage = useSharedValue({ max:0, min: 0 });

    const onGestureHandler = useAnimatedGestureHandler({
        onStart() {
            contextX.value = scrollOffset.value;
        },
        onActive(event) {
            scrollOffset.value = Math.min(contextX.value + event.translationX, 0);
        },
        onFinish() {
            contextX.value = 0;
        },
    });

    const onPinchGestureHandler = useAnimatedGestureHandler({
        onStart(event) {
            scaleContextX.value = scaleX.value;
            contextX.value = scrollOffset.value;
            focalX.value = event.focalX;
        },
        onActive(event) {
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
            focalX.value = 0;
        },
    });

    const onLongPressGestureHandler = useAnimatedGestureHandler({
        onStart(event) {
            isActived.value = false
        },
        onActive(event) {
            // console.log(event)
            isActived.value = true;
            lineTranslateX.value = event.x;
            lineTranslateY.value = event.y;
        },
        onFinish() {
            isActived.value = false;
        },
    });

    // initial caliber and numbers
    const values = data
        .slice(0, Math.floor(width / caliber) + 1)
        .map(item => [item.low, item.high])
        .flat();
    const domain = [Math.min(...values), Math.max(...values)];
    const scaleY = scaleLinear().domain(domain).range([height, 0]);
    const scaleBody = scaleLinear()
        .domain([0, domain[1] - domain[0]])
        .range([0, height]);

    const caliberWidth = useDerivedValue(()=>{
        return scaleX.value * caliber
    },[scaleX])

    useDerivedValue(() => {
        const numberInViewCandles = Math.floor(width / caliberWidth.value) + 1;
        const startIndex = Math.floor(Math.abs(scrollOffset.value) / caliberWidth.value);
        const endIndex = startIndex + numberInViewCandles;
        if (startEndRange.value[0] !== startIndex || startEndRange.value[1] !== endIndex) {
            startEndRange.value = [startIndex, endIndex];
        } else {
            return; //avoid calculation
        }
        // avoid chart out side
        if (startIndex < data.length - 1) {
            const inRangeValues = data
                .slice(startIndex, endIndex)
                .map(item => [item.low, item.high])
                .flat();
            maxMinArrage.value = {
                max: Math.max(...inRangeValues),
                min: Math.min(...inRangeValues),
            };
            const newInputRange = [maxMinArrage.value.min, maxMinArrage.value.max];
            if (
                newInputRange[0] !== inputRange.value[0] ||
                newInputRange[1] !== inputRange.value[1]
            ) {
                inputRange.value = newInputRange;
            }
        }
    }, [scrollOffset, caliber, scaleX, data]);

    const candlesComponents = useMemo(
        () =>
            data.map((item, index) => {
                return (
                    <Candle
                        key={item.date}
                        {...{ candle: item, caliber, index, scaleY, scaleBody }}
                    />
                );
            }),
        [data]
    );

    const rStyle = useAnimatedStyle(() => {
        const translateXMax = interpolate(maxMinArrage.value.max, domain, [height, 0]);
        const translateXMin = interpolate(maxMinArrage.value.min, domain, [height, 0]);
        const scaleY = 1 / ((translateXMin - translateXMax) / height);
        // console.log(translateXMin - translateX, scaleY);
        // console.log(
        //     "scale",
        //     "translatXMax:",
        //     translateXMax,
        //     "scaleY:",
        //     scaleY,
        //     "scaleX:",
        //     scaleX,
        //     "startEndRange:",
        //     startEndRange
        // );
        return {
            transform: [
                { translateX: Math.min(scrollOffset.value, 1) },
                { scaleX: scaleX.value },
                { scaleY: scaleY },
                { translateY: -translateXMax },
            ],
        };
    });

    // const processedData = data.map((data, index) => [
    //     caliber * index + 0.5 * caliber + 1,
    //     scaleY(data.high),
    // ]);
    // const lineGrerator = line()
    //     .x(d => d[0])
    //     .y(d => d[1]);
    // const d = lineGrerator(processedData);


    const rHorizontalLineStyle = useAnimatedStyle(() => {
        const tranY = Math.max(Math.min(lineTranslateY.value, width), 0)
        return {
            opacity: isActived.value ? withTiming(1) : withTiming(0),
            transform: [{ translateY: tranY }],
        };
    });
    const rVerticalLineStyle = useAnimatedStyle(() => {
        const tranX =
            Math.floor(Math.min(lineTranslateX.value, height) / caliberWidth.value) *
                caliberWidth.value +
            caliberWidth.value / 2 +
            (scrollOffset.value % caliberWidth.value) + MARGIN/2
        return {
            opacity: isActived.value ? withTiming(1) : withTiming(0),
            transform: [{ translateX: tranX }],
        };
    });
    const textValue = useDerivedValue(()=>{
        return `${interpolate(lineTranslateY.value, [0, height], [inputRange.value[1], inputRange.value[0]]).toFixed(2)}`
    })
    return (
        <View style={styles.container}>
            <View style={{ height: 100 }}></View>
            <View>
                <Svg width={width} height={height}>
                    <AnimatedG style={rStyle}>
                        {candlesComponents}
                        {/* <Path d={d} stroke={"white"} fill="transparent" /> */}
                    </AnimatedG>
                </Svg>
                <LongPressGestureHandler onGestureEvent={onLongPressGestureHandler}>
                    <Animated.View style={[StyleSheet.absoluteFill]}>
                        <PanGestureHandler onGestureEvent={onGestureHandler}>
                            <Animated.View style={[StyleSheet.absoluteFill]}>
                                <PinchGestureHandler onGestureEvent={onPinchGestureHandler}>
                                    <Animated.View style={[StyleSheet.absoluteFill]}>
                                        <Animated.View
                                            style={[
                                                StyleSheet.absoluteFillObject,
                                                rHorizontalLineStyle,
                                            ]}
                                        >
                                            <Line x={width} y={0} />
                                        </Animated.View>
                                        <Animated.View
                                            style={[
                                                StyleSheet.absoluteFillObject,
                                                rVerticalLineStyle,
                                            ]}
                                        >
                                            <Line x={0} y={height} />
                                        </Animated.View>
                                        <Label
                                            translateY={lineTranslateY}
                                            isActived={isActived}
                                            textValue={textValue}
                                            width={width}
                                        />
                                    </Animated.View>
                                </PinchGestureHandler>
                            </Animated.View>
                        </PanGestureHandler>
                    </Animated.View>
                </LongPressGestureHandler>
            </View>
        </View>
    );
};
