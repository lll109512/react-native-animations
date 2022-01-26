import { StyleSheet, Text, View,Dimensions } from 'react-native';
import React, { useMemo, useRef } from 'react';
import Svg, { G, Line, Path } from 'react-native-svg';
import Candle from './Candle';
import { scaleLinear } from "d3-scale";
import Animated,{ interpolate, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { random, sortBy } from 'lodash';
import { line, area, curveCardinal } from "d3-shape";
const screen = Dimensions.get('screen')

const AnimatedSvg = Animated.createAnimatedComponent(Svg)
const AnimatedG = Animated.createAnimatedComponent(G)

const Chart = props => {
    const {
        height = screen.width,
        width = screen.width,
        caliber,
        data,
        scrollOffset,
        scaleX,
    } = props;
    // const caliber = 6
    const values = data.slice(0,Math.floor(width / caliber) + 1).map(item => [item.low, item.high]).flat();
    const domain = [Math.min(...values), Math.max(...values)];
    const scaleY = scaleLinear().domain(domain).range([height, 0]);
    const scaleBody = scaleLinear().domain([0,domain[1]-domain[0]]).range([0,height])

    const inputRange = useSharedValue([7505.65,8453.31])
    const startEndRange = useSharedValue([0,100])
    const maxMinArrage = useSharedValue({ max: Math.floor(width / caliber) + 1, min: 0 });

    useDerivedValue(() => {
        const caliberWidth = scaleX.value * caliber;
        const numberInViewCandles = Math.floor(width / caliberWidth) + 1;
        const startIndex = Math.floor(Math.abs(scrollOffset.value) / caliberWidth);
        const endIndex = startIndex + numberInViewCandles;
        if (startEndRange.value[0] !== startIndex || startEndRange.value[1] !== endIndex) {
            startEndRange.value = [startIndex, endIndex];
        } else {
            return; //avoid calculation
        }
        // avoid chart out side
        if(startIndex < data.length-1){
            const inRangeValues = data
                .slice(startIndex, endIndex)
                .map(item => [item.low, item.high])
                .flat();
            maxMinArrage.value = {
                max: Math.max(...inRangeValues),
                min: Math.min(...inRangeValues),
            };
            const newInputRange = [maxMinArrage.value.min, maxMinArrage.value.max];
            if (newInputRange[0] !== inputRange.value[0] || newInputRange[1] !== inputRange.value[1]) {
                inputRange.value = newInputRange;
            }
        }
    }, [scrollOffset, caliber, scaleX,data]);

    const candlesComponents = useMemo(
        () =>
            data.map((item, index) => {
                return <Candle key={item.date} {...{ candle: item, caliber, index,scaleY,scaleBody }} />;
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

    const processedData = data.map((data, index) => [caliber * index+0.5*caliber+1, scaleY(data.high)]);
    const lineGrerator = line()
        .x(d => d[0])
        .y(d => d[1])
    const d = lineGrerator(processedData);
    return (
        <Svg width={width} height={height}>
            <AnimatedG style={rStyle}>
                {candlesComponents}
                <Path d={d} stroke={'white'} fill="transparent" />
            </AnimatedG>
        </Svg>
    );
};;

export default Chart;

const styles = StyleSheet.create({});
