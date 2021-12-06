import React from 'react'
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { images } from 'src/data/data'
import { height } from '../SharedElement/one/constants';

const MIN_IMAGE_HEIGHT = 120
const MAX_IMAGE_HEIGHT = 520

const Item = (props)=>{ 
    const {image,y,index} = props
    const rStyle = useAnimatedStyle(()=>{
        return {
            height:
                interpolate(
                    y.value||0,
                    [(index - 1) * MAX_IMAGE_HEIGHT, index * MAX_IMAGE_HEIGHT],
                    [MIN_IMAGE_HEIGHT, MAX_IMAGE_HEIGHT],
                    Extrapolate.CLAMP
                ),
        };
    })
    return (
        <Animated.View style={[rStyle]}>
            <Image source={{ uri: image.image }} style={styles.image}></Image>
        </Animated.View>
    );
}

const index = (props) => {
    const scrollY = useSharedValue()
    const handleScroll = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
        console.log(event.contentOffset.y)
    });
    return (
        <View style={{ flex: 1 }}>
            <Animated.ScrollView
                bounces={false}
                decelerationRate="fast"
                contentContainerStyle={{ height: (images.length - 2) * MAX_IMAGE_HEIGHT }}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                style={{ flex: 1 }}
                snapToInterval={MAX_IMAGE_HEIGHT}
            >
                {images.map((item, i) => (
                    <Item key={item.key} image={item} index={i} y={scrollY} />
                ))}
            </Animated.ScrollView>
        </View>
    );
}

export default index

const styles = StyleSheet.create({
    image: {
        // height: MIN_IMAGE_HEIGHT,
        // width:'100%',
        ...StyleSheet .absoluteFillObject,
        resizeMode:"cover"
    },
});
