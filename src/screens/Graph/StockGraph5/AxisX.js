import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ReText } from 'react-native-redash';
import { interpolate, useDerivedValue } from 'react-native-reanimated';

const AxisLabel = (props) =>{
    const { index, distance, inputRange, height } = props;
    const animatedTexts = useDerivedValue(() => {
        // console.log(inputRange);
        return `${interpolate(
            distance * index,
            [0, height],
            [inputRange.value[1], inputRange.value[0]]
        ).toFixed(2)}`;
    }, [inputRange]);
    return (
        <ReText style={[styles.label, { top:distance*index }]} text={animatedTexts} />
    );
}

const AxisX = (props) => {
    const { inputRange, height,numberOfIndicator = 4 } = props;
    const distance = height / (numberOfIndicator);
    return (
        <View style={[styles.root, { height }]} pointerEvents="none">
            {Array(numberOfIndicator)
                .fill(0)
                .map((_, index) => (
                    <AxisLabel key={index} {...{ index, inputRange, height, distance }} />
                ))}
        </View>
    );
};

export default AxisX;

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        color: "white",
        transform:[{translateY:-6}],
        right:0,
        top:0,
        position:"absolute",
    },
    root: {
        position:"absolute",
        right: 0,
    },
});
