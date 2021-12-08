import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import numeral from 'numeral'
import { random } from 'lodash'

const DIGITAL_HEIGHT = 30

const Digital = (props)=>{
    const {index,counter} = props
    const containerStyle = useAnimatedStyle(()=>{
        const offset = - counter.value[index] * DIGITAL_HEIGHT;
        return {
            transform: [{ translateY: withSpring(offset, { stiffness:35}) }],
        };
    })
    return (
        <View>
            <View style={styles.mask}>
                <Animated.View style={[containerStyle]}>
                    {Array(10)
                        .fill(0)
                        .map((_, i) => (
                            <View key={i} style={styles.digitalContainer}>
                                <Text style={styles.digital}>{i}</Text>
                            </View>
                        ))}
                </Animated.View>
            </View>
        </View>
    );
}

const Counter = (props)=>{
    const {number=0,maxNumberCount=6} = props
    const convertNumberToString = (number,maxNumberCount)=>{
        "worklet";
        return `${number}`.padStart(maxNumberCount,'0');
    }
    const counter = useSharedValue(convertNumberToString(number,maxNumberCount));
    useAnimatedReaction(
        () => counter.value,
        (current, previous) => {
            counter.value = convertNumberToString(number, maxNumberCount);
            console.log(counter.value)
        },
        [number, maxNumberCount]
    );
    return (
        <View style={styles.counterContainer}>
            {Array(maxNumberCount).fill(0).map((_,index)=>{
                return <View key={index} style={styles.digitalItem}>
                    <Digital index={index} counter={counter}/>
                </View>
            })}
        </View>
    );
}

const index = (props) => {
    const [number, setNumber] = useState(123456)
    return (
        <View style={styles.root}>
            <Counter number={number} maxNumberCount={6}/>
            <View style={styles.btns}>
                <Button title="add one" onPress={() => setNumber(c => c + 1)} />
                <Button title="minus one" onPress={() => setNumber(c => c - 1)} />
                <Button title="random" onPress={() => setNumber(random(999999))} />
            </View>
        </View>
    );
}

export default index

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    counterContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    digitalItem: {
        marginHorizontal: 8,
    },
    digital: {
        fontSize: 24,
        fontWeight: "600",
        color: "rgba(0,0,0,0.8)",
    },
    digitalContainer: {
        height: DIGITAL_HEIGHT,
    },
    btns: {
        marginTop: 12,
    },
    mask: {
        height: DIGITAL_HEIGHT,
        overflow: "hidden",
    },
});
