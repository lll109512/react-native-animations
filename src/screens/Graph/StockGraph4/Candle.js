import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import { G, Line, Rect } from 'react-native-svg';
import Animated, { interpolate, useAnimatedProps, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const MARGIN = 2
const AnimatedLine = Animated.createAnimatedComponent(Line)
const AnimatedRect = Animated.createAnimatedComponent(Rect)
const AnimatedG = Animated.createAnimatedComponent(G)

const Candle = (props) => {
    const { candle, caliber, scaleY, scaleBody, index } = props;
    const { high, low, open, close } = candle;
    const x = caliber * index + 0.5 * caliber;
    const color = open > close ? "#4AfA9A" : "#E33F64";
    return (
        <>
            <Line
                x1={x + MARGIN / 2}
                x2={x + MARGIN / 2}
                y1={scaleY(high)}
                y2={scaleY(low)}
                stroke={color}
                strokeWidth={1}
            />
            <Rect
                x={caliber * index + MARGIN}
                y={scaleY(Math.max(open, close))}
                width={caliber - MARGIN}
                height={scaleBody(Math.max(open, close) - Math.min(open, close))}
                fill={color}
            />
        </>
    );
};

export default Candle;

const styles = StyleSheet.create({});
