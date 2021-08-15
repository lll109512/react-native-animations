import React, { useState,useEffect } from "react";
import { StatusBar, StyleSheet, Text, View,FlatList,Dimensions, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import faker from 'faker'
import Animated,{useAnimatedGestureHandler, useSharedValue,interpolate, timing, withTiming, useAnimatedStyle} from 'react-native-reanimated'
// import { Image } from "react-native-animatable";
import { Directions, FlingGestureHandler, State } from "react-native-gesture-handler";
import { SharedElement } from "react-navigation-shared-element";
import {images} from 'src/data/data'
import FastImage from "react-native-fast-image";


const screen = Dimensions.get('screen')

const IMAGE_WIDTH = screen.width * 0.86
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.5
const VISIABLE_ITEM = 4

const fakeData = images.map(item => ({
    key: String(item.key),
    image: item.image,
    name: item.location,
}));

const RenderItem = ({ item, animatedValue, index, navigation,activeIndex }) => {
    const style = useAnimatedStyle(() => {
        const inputRange = [index - 1, index, index + 1];
        const translateY = interpolate(animatedValue.value, inputRange, [-30, 0, 30]);
        const opacity = interpolate(animatedValue.value, inputRange, [1 - 1 / VISIABLE_ITEM, 1, 0]);
        const scale = interpolate(animatedValue.value, inputRange, [0.92, 1, 1.2]);
        return {
            transform: [{ translateY }, { scale }],
            opacity,
        };
    });
    return (
        <Animated.View
            key={index}
            style={[
                {
                    position: "absolute",
                },
                style,
            ]}
        >
            <TouchableOpacity
                onPress={() => navigation.push("CardDetail", { item: fakeData[activeIndex] })}
            >
                <SharedElement id={`item.${item.key}.photo`}>
                    <FastImage source={{ uri: item.image }} style={styles.image} />
                </SharedElement>
                <View
                    style={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <SharedElement id={`item.${item.key}.name`}>
                        <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit={true}>
                            {item.name}
                        </Text>
                    </SharedElement>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const CardList = ({navigation}) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const animatedValue = useSharedValue(0)
    return (
        <FlingGestureHandler
            key="up"
            direction={Directions.UP}
            onHandlerStateChange={ev=>{
                if(ev.nativeEvent.state === State.END){
                    if(activeIndex===fakeData.length-1) return
                    setActiveIndex(activeIndex + 1);
                    animatedValue.value = withTiming(activeIndex+1);
                }
            }}
        >
            <View style={{flex:1}}>
                <FlingGestureHandler
                    key="up"
                    direction={Directions.DOWN}
    
                    onHandlerStateChange={ev=>{ 
                        if(ev.nativeEvent.state === State.END){
                            if (activeIndex === 0 ) return;
                                setActiveIndex(activeIndex - 1);
                                animatedValue.value = withTiming(activeIndex-1);
                        }
                    }}
                >
                    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)" }}>
                        <FlatList
                            data={fakeData}
                            keyExtractor={item => item.key}
                            scrollEnabled={false}
                            CellRendererComponent={({index,item,children,style,...props})=>{
                                const newStyle = [
                                    style,
                                    {
                                        left: -IMAGE_WIDTH / 2,
                                        top: -IMAGE_HEIGHT / 2,
                                        zIndex: fakeData.length - index,
                                    },
                                ];
                                return <View index={index} {...props} style={newStyle}>{children}</View>;
                            }}
                            contentContainerStyle={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <RenderItem
                                        item={item}
                                        index={index}
                                        animatedValue={animatedValue}
                                        navigation={navigation}
                                        activeIndex={activeIndex}
                                    />
                                );
                            }}
                        />
                    </SafeAreaView>
                </FlingGestureHandler>
            </View>
        </FlingGestureHandler>
    );
}; 

export default CardList;

const styles = StyleSheet.create({
    testText: {
        color: "white",
    },
    image: {
        width: IMAGE_WIDTH,
        height:IMAGE_HEIGHT,
        resizeMode:"cover",
        borderRadius:16,
    },
    name: {
        textTransform:'uppercase',
        color:"white",
        fontWeight:"900",
        fontSize:30,
    },
});
