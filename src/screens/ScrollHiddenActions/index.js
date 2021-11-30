import React from 'react'
import faker from "faker";
import { BlurView } from "@react-native-community/blur";
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { StyleSheet, Text, View,Dimensions } from 'react-native';
const screen = Dimensions.get('screen')
const BlurHeader = (props)=>{
    const { title, animatedIndex } = props;
    const rStyle = useAnimatedStyle(() => {
        return { transform: [{ translateY: -animatedIndex.value * 40 }] };
    });
    return (
        <Animated.View style={[styles.header, rStyle]}>
            <BlurView blurType="xlight" blurAmount={10} reducedTransparencyFallbackColor="white">
                <Text style={styles.headerText}>{title}</Text>
            </BlurView>
        </Animated.View>
    );
}

const BlurActions = (props)=>{
    const { animatedIndex } = props;
    const rStyle = useAnimatedStyle(()=>{
        return { transform: [{ translateY: animatedIndex.value * 80 }] };
    })
    return (
        <Animated.View style={[styles.actions, rStyle]}>
            <View style={styles.container}>
                <BlurView
                    blurType="xlight"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                >
                    <View style={styles.actionsBar}>
                        <Text>Actions</Text>
                    </View>
                </BlurView>
            </View>
        </Animated.View>
    );
}
const index = (props) => {
    const data = Array(20).fill(0).map(_ => faker.lorem.paragraph());
    const scrollY = useSharedValue(0) 
    const revertPointY = useSharedValue(0)
    const previousY = useSharedValue(0)
    // const actionsIndex = useSharedValue(0)
    // const direction = useDerivedValue(()=>{
    //     if(scrollY.value > previousY.value){
    //         return 1
    //     }else{
    //         return 0
    //     }
    // })
    const actionsIndex = useDerivedValue(() => {
        if (scrollY.value > previousY.value) {
            return withTiming(1,{duration:500})
        } else {
            return withTiming(0,{duration:500})
        }
    });
    const onScroll = useAnimatedScrollHandler({
        onScroll: ({ contentOffset: { y } }) => {
            previousY.value = scrollY.value
            scrollY.value = y;
        },
    });
    return (
        <View style={styles.root}>
            <Animated.ScrollView
                style={{ paddingTop: 90 }}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {data.map(item => (
                    <Text style={styles.paragraph}>{item}</Text>
                ))}
            </Animated.ScrollView>
            <BlurHeader title="Article" animatedIndex={actionsIndex} />
            <BlurActions animatedIndex={actionsIndex} />
        </View>
    );
}

export default index

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "white" },
    paragraph: { paddingHorizontal: 12, paddingVertical: 12 },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    headerText: {
        textAlign: "center",
        marginTop: 50,
        marginBottom: 10,
        color: "black",
        fontSize: 20,
        fontWeight: "600",
    },
    actions: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        marginBottom: 0,
        flexDirection: "row",
    },
    actionsBar: {
        height: 80,
        width: screen.width,
        borderRadius: 10,
        // borderWidth: 0.2,
        borderColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
});
