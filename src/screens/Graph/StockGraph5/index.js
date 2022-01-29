import React, { useEffect, useState, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LongPressGestureHandler, PanGestureHandler,PinchGestureHandler } from "react-native-gesture-handler";
import Chart from "./Chart";

import data from "./data.json";
import Svg, { G, Path } from 'react-native-svg';
import Candle from './Candle';
import { scaleLinear } from "d3-scale";
import Animated,{ interpolate, useAnimatedProps, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming, Extrapolate } from 'react-native-reanimated';
import { line, area, curveCardinal } from "d3-shape";
import Label from "./Label";
import Line from "./Line";
import AxisX from "./AxisX";
const MARGIN = 2

const AnimatedG = Animated.createAnimatedComponent(G)


const screen = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
});

const height = screen.width*0.8
const width = screen.width
export default (props) => {
    const caliber = 10;
    const initStartIndex = data.length - (Math.floor(width / caliber) + 1);
    const initEndIndex = data.length;
    const isActived = useSharedValue(false);
    const scrollOffset = useSharedValue(-initStartIndex * caliber);
    const contextX = useSharedValue(0);
    const scaleX = useSharedValue(1);
    const scaleContextX = useSharedValue(0);
    const focalX = useSharedValue(0);

    const lineTranslateX = useSharedValue(0);
    const lineTranslateY = useSharedValue(0);

    const startEndRange = useSharedValue([0, Math.floor(width / caliber) + 1]);
    const maxMinArrage = useSharedValue({ max: 0, min: 0 });
    
    // initial caliber and numbers
    const values = data
                    .slice(initStartIndex, initEndIndex)
                    .map(item => [item.low, item.high])
                    .flat();
    const domain = [Math.min(...values), Math.max(...values)];
    const scaleY = scaleLinear().domain(domain).range([height, 0]);
    const scaleBody = scaleLinear()
                    .domain([0, domain[1] - domain[0]])
                    .range([0, height]);
    
    const caliberWidth = useDerivedValue(() => {
        return scaleX.value * caliber;
    }, [scaleX]);

    const numberInViewCandles = useDerivedValue(() => {
        return Math.floor(width / caliberWidth.value) + 1;
    }, [caliberWidth]);
    
    const inputRange = useSharedValue([0, 0]);
    useEffect(()=>{
        inputRange.value = [domain[0], domain[1]];
        scrollOffset.value -= 1
    },[domain])
    const onGestureHandler = useAnimatedGestureHandler({
        onStart() {
            contextX.value = scrollOffset.value;
        },
        onActive(event) {
            scrollOffset.value = Math.max(Math.min(contextX.value + event.translationX, 0), -caliberWidth.value * (data.length - numberInViewCandles.value))
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
            isActived.value = false;
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

    useDerivedValue(() => {
        const startIndex = Math.floor(Math.abs(scrollOffset.value) / caliberWidth.value);
        const endIndex = startIndex + numberInViewCandles.value;
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
        //     scaleX.value,
        //     "startEndRange:",
        //     startEndRange,
        //     "domain:",
        //     domain,
        //     "maxMinArrage",
        //     maxMinArrage
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

    const rHorizontalLineStyle = useAnimatedStyle(() => {
        const tranY = Math.max(Math.min(lineTranslateY.value, height), 0);
        return {
            opacity: isActived.value ? withTiming(1) : withTiming(0),
            transform: [{ translateY: tranY }],
        };
    });

    const rVerticalLineStyle = useAnimatedStyle(() => {
        const tranX =
            Math.floor(Math.min(lineTranslateX.value, width) / caliberWidth.value) *
                caliberWidth.value +
            caliberWidth.value / 2 +
            (scrollOffset.value % caliberWidth.value) +
            MARGIN / 2;
        return {
            opacity: isActived.value ? withTiming(1) : withTiming(0),
            transform: [{ translateX: tranX }],
        };
    });
    const textValue = useDerivedValue(() => {
        return `${interpolate(
            lineTranslateY.value,
            [0, height],
            [inputRange.value[1], inputRange.value[0]],Extrapolate.CLAMP
        ).toFixed(2)}`;
    });
    return (
        <View style={styles.container}>
            <View style={{ height: 100 }}></View>
            <View>
                <>
                    <Svg width={width} height={height}>
                        <AnimatedG style={[rStyle]}>{candlesComponents}</AnimatedG>
                    </Svg>
                    <AxisX inputRange={inputRange} height={height} />
                </>
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
                                            height={height}
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
