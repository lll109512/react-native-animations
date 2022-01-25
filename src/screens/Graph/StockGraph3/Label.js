import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Animated, { interpolate, useAnimatedProps, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { ReText } from 'react-native-redash';

const Label = (props) => {
    const { domain, translateY, size, isActived } = props;
    const rStyle = useAnimatedStyle(()=>{
        return {
            transform: [{ translateY: translateY.value }],
            opacity: isActived.value ? withTiming(1) : withTiming(0),
        };
    })
    const textValue = useDerivedValue(()=>{
        return `${interpolate(translateY.value, [0, size], [domain[1], domain[0]]).toFixed(2)}`
    })
    return (
        <Animated.View style={[styles.container, rStyle]}>
            <ReText style={styles.label} text={textValue}></ReText>
        </Animated.View>
    );
};

export default Label;

const styles = StyleSheet.create({
    label: {
        color: "black",
    },
    container: {
        backgroundColor: "white",
        alignSelf:'flex-end',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginTop:-12
    },
});
