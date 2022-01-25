import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { scaleLinear } from "d3-scale";
import { line, area, curveCardinal } from "d3-shape";
import Svg, { Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { sum } from 'lodash';

const exampleData = [
    10,20,10,30,10,50,20,100,0,10
]

const StockLineChip = (props) => {
    const { datas=exampleData, color = "#4AFA9A",height=60,width=120,backgroundColor='black' } = props;
    const scaleY = scaleLinear()
        .domain([Math.min(...datas), Math.max(...datas)])
        .range([height-3, 0+3]);
    const processedData = datas.map((data, index) => [(width / datas.length) * index, scaleY(data)]);
    const lineGrerator = line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(curveCardinal);
    const d = lineGrerator(processedData);
    const areaGenerator = area()
        .x(d => d[0])
        .y0(d => d[1])
        .y1(d => height)
        .curve(curveCardinal);
    const a = areaGenerator(processedData);
    const middle = scaleY(sum(datas) / datas.length)
    return (
        <Svg height={height} width={width}>
            <Path d={a} fill={"url(#grad1)"} />
            <Path d={d} stroke={color} fill="transparent" />
            <Defs>
                <LinearGradient id="grad1" x1="0%" y1="20%" x2="0%" y2="100%">
                    <Stop offset="0" stopColor={color} stopOpacity={0.3} />
                    <Stop offset="1" stopColor={backgroundColor} stopOpacity={0} />
                </LinearGradient>
            </Defs>
            <Line
                x1={0}
                y1={middle}
                x2={width}
                y2={middle}
                strokeWidth={0.5}
                stroke="white"
                strokeDasharray="3 3"
            />
        </Svg>
    );
};

export default StockLineChip;

const styles = StyleSheet.create({});
