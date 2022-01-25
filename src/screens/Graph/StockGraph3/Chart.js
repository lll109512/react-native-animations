import { StyleSheet, Text, View,Dimensions } from 'react-native';
import React, { useMemo, useRef } from 'react';
import Svg, { G, Line } from 'react-native-svg';
import Candle from './Candle';
import { scaleLinear } from "d3-scale";
import Animated,{ interpolate, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { sortBy } from 'lodash';
const screen = Dimensions.get('screen')

const AnimatedSvg = Animated.createAnimatedComponent(Svg)
const AnimatedG = Animated.createAnimatedComponent(G)

const Chart = (props) => {
    const { height = screen.width, width = screen.width, caliber, data, scrollOffset } = props;
    // const caliber = 6
    // const scaleY = scaleLinear().domain(domain).range([size, 0]);
    // const scaleBody = scaleLinear().domain([0,domain[1]-domain[0]]).range([0,size])
    
    const inputRange = useSharedValue([0,0])
    const startEndRange = useSharedValue([0,100])
    const maxMinArrage = useSharedValue({max:null,min:null})
    useDerivedValue(()=>{
        // console.log(scrollOffset);
        const numberInViewCandles = Math.floor(width / caliber.value) + 4;
        const startIndex = Math.floor(Math.abs(scrollOffset.value) / caliber.value);
        const endIndex = startIndex + numberInViewCandles;
        console.log(startIndex, endIndex);
        if(startEndRange.value[0]!==startIndex||startEndRange.value[1]!==endIndex){
            startEndRange.value = [startIndex,endIndex]
        }else{
            return //avoid calculation
        }
        // if(maxMinArrage.value.max === null && maxMinArrage.value.min === null){
            const inRangeValues = data
                .slice(startIndex, endIndex)
                .map(item => [item.low, item.high])
                .flat();
            maxMinArrage.value = {
                max: Math.max(...inRangeValues),
                min: Math.min(...inRangeValues),
            };
            const newInputRange = [maxMinArrage.value.min, maxMinArrage.value.max];
        // }else{
            // if (startIndex-oldStartEndRange[0] > 0) {
            //     const removeItemsHighSortFirst = data.slice(oldStartEndRange[0], startIndex).map(item=>item.high).sort(i=>-i)
            //     const addedItemsLowSortFirst = data.slice(oldStartEndRange[1], endIndex).map(item=>item.low).sort(i=>-Math.abs(i))
                
            // }

            if (newInputRange[0] !== inputRange.value[0] || newInputRange[1] !== inputRange.value[1]){
                inputRange.value = newInputRange;
            }
        // }
        // return inputRange;
    },[scrollOffset,caliber])


    // useAnimatedReaction(
    //     () => [scrollOffset.value, caliber.value],
    //     (current, previous) => {

    //     },
    //     [scrollOffset, caliber]
    // );

    const scaleY = (value)=>{
        "worklet"
        // console.log(value, inputRange.value, height);
        return interpolate(value, inputRange.value, [height, 0]);
    }
    const candlesComponents = useMemo(()=>data.map((item,index)=>{
        return (
            <Candle
                key={item.date}
                {...{ candle: item, caliber, index, scaleY,height,inputRange,startEndRange }}
            />
        );
    }),[data])

    const rStyle = useAnimatedStyle(()=>{
        return {
            transform:[{translateX:Math.min(scrollOffset.value,0)}]
        }
    })
    return (
        <Svg width={width} height={height}>
            <AnimatedG style={rStyle}>
                {candlesComponents}
            </AnimatedG>
        </Svg>
    );
};

export default Chart;

const styles = StyleSheet.create({});
