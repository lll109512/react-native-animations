import React from 'react'
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import faker from "faker";
import Animated,{useAnimatedStyle, useSharedValue,useAnimatedScrollHandler, interpolate} from 'react-native-reanimated'
import {images} from 'src/data/data'
import FastImage from 'react-native-fast-image';
import AntDesign from "react-native-vector-icons/AntDesign";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const { height, width } = Dimensions.get('screen')


const RenderItem = ({ item, index, translateX }) => {
    const inputRange = [
        (index - 1) * width,
        (index) * width,
        (index+1) * width,
    ]
    const style = useAnimatedStyle(()=>{
        const x = interpolate(translateX.value, inputRange, [-width * 0.2, 0, width * 0.2]);
        return {
            transform: [{ translateX:x }],
        };
    })
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.border}>
                    <View style={styles.imageContainer}>
                        <AnimatedFastImage
                            source={{ uri: item.image }}
                            style={[styles.image, StyleSheet.absoluteFillObject, style]}
                        />
                    </View>
                </View>
                <View style={styles.avatarContainer}>
                    <FastImage source={{ uri: faker.internet.avatar() }} style={styles.avatar} />
                </View>
            </View>
        </View>
    );
};

const index = ({ navigation }) => {
    const translateX = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler({
        onScroll: ({ contentOffset: { x } }) => {
            translateX.value = x;
        },
    });
    return (
        <View>
            <AntDesign
                name="arrowleft"
                size={24}
                color={"#000"}
                style={{
                    paddingHorizontal: 12,
                    position: "absolute",
                    top: 40,
                    left: 10,
                    zIndex: 2,
                }}
                onPress={() => {
                    navigation.goBack();
                }}
            />
            <AnimatedFlatList
                data={images}
                keyExtractor={item => item.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                    return <RenderItem item={item} index={index} translateX={translateX} />;
                }}
            />
        </View>
    );
};

export default index

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        height:'auto',
        width:width * 1.1,
        marginLeft:-width * 0.2,
        resizeMode:'contain'
    },
    imageContainer: {
        height: height * 0.6,
        width: width * 0.75,
        borderRadius: 16,
        overflow:"hidden",
        // alignItems:"center",
        // justifyContent:'center',
        // display:"flex",
        // flexDirection:'row'
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 4,
        borderColor: "#fff",
    },
    avatarContainer: {
        position: "absolute",
        bottom: -30,
        right: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 8,
    },
    border: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 8,
    },
});
