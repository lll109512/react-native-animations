import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import { G, Line, Rect } from 'react-native-svg';
import Animated, { interpolate, useAnimatedProps } from 'react-native-reanimated';

const MARGIN = 2
const AnimatedLine = Animated.createAnimatedComponent(Line)
const AnimatedRect = Animated.createAnimatedComponent(Rect)
const AnimatedG = Animated.createAnimatedComponent(G)

const Candle = (props) => {
    const { candle, caliber, index, height, inputRange, startEndRange } = props;
    const {high,low,open,close,date} = candle
    const color = open>close ? "#4AfA9A":"#E33F64"
    const rLineProps = useAnimatedProps(()=>{
        const x = caliber.value * index + 0.5 * caliber.value
        // const isInRange = startEndRange.value[0]<=index<=startEndRange.value[1]
        console.log(date);
        return {
            x1: x + MARGIN / 2,
            x2: x + MARGIN / 2,
            y1: interpolate(high, inputRange.value, [height, 0]),
            y2: interpolate(low, inputRange.value, [height, 0]),
        };
    })
    const rRectProps = useAnimatedProps(()=>{
        // const isInRange = startEndRange.value[0] <= index <= startEndRange.value[1];
        return {
            x: caliber.value * index + MARGIN,
            width: caliber.value - MARGIN,
            y: interpolate(Math.max(open, close), inputRange.value, [height, 0]),
            height: interpolate(
                Math.max(open, close) - Math.min(open, close),
                [0, inputRange.value[1] - inputRange.value[0]],
                [0, height]
            ),
        };
    })
    return (
        <>
            <AnimatedLine
                stroke={color}
                strokeWidth={1}
                animatedProps={rLineProps}
            />
            <AnimatedRect
                fill={color}
                animatedProps={rRectProps}
            />
        </>
    );
};

export default Candle;

const styles = StyleSheet.create({});
