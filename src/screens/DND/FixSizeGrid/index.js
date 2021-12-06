import React, { useState } from 'react'
import { StyleSheet, Text, View,Dimensions,SafeAreaView, Image } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { images } from 'src/data/data'
const screen = Dimensions.get('screen')

const MARGIN = 12
const CONTAINER_SIZE_WIDTH = screen.width / 2;
const CONTAINER_SIZE_HEIGHT = screen.height / 3;
const IMAGE_SIZE_WIDTH = CONTAINER_SIZE_WIDTH - MARGIN * 2;
const IMAGE_SIZE_HEIGHT = CONTAINER_SIZE_HEIGHT - MARGIN * 2;



const listToObject = (list) => {
    const values = Object.values(list);
    const object = {};

    for (let i = 0; i < values.length; i++) {
        object[values[i].id] = values[i];
    }

    return object;
}
const listToObjectPosition = (list) => {
    const values = Object.values(list);
    const object = {};

    for (let i = 0; i < values.length; i++) {
        object[values[i].key] = {x:i % 2, y:Math.floor(i / 2)}
    }

    return object;
}

const objectMove = (object, from, to)=> {
    "worklet";
    const newObject = Object.assign({}, object);
    for (const id in object) {
        if (object[id].x === from.x && object[id].y === from.y) {
            newObject[id] = {x:to.x,y:to.y}
        }
        
        if (object[id].x === to.x && object[id].y === to.y) {
            newObject[id] = {x:from.x,y:from.y}
        }
    }
    return newObject;
}

const clamp = (value, lowerBound, upperBound) => {
    "worklet";
    return {
        x: Math.max(lowerBound.x, Math.min(value.x, upperBound.x)),
        y: Math.max(lowerBound.y, Math.min(value.y, upperBound.y)),
    };
}


const DNDContainer = (props)=>{
    const { style, children, id, positionIndex, length } = props;
    const [moving, setMoving] = useState(false)
    const positionX = useSharedValue(positionIndex.value[id].x * CONTAINER_SIZE_WIDTH);
    const positionY = useSharedValue(positionIndex.value[id].y * CONTAINER_SIZE_HEIGHT + 50);
    const moveX = useSharedValue(0);
    const moveY = useSharedValue(0);
    const onGestureEvent = useAnimatedGestureHandler({
        onStart:(e)=>{
            runOnJS(setMoving)(true)
        },
        onActive:({translationX,translationY,a})=>{
            moveX.value = translationX
            moveY.value = translationY

            const newPositionX = positionX.value + moveX.value;
            const newPositionY = positionY.value + moveY.value;

            const newPosition = clamp(
                {
                    x:Math.floor(newPositionX / CONTAINER_SIZE_WIDTH),
                    y:Math.floor(newPositionY / CONTAINER_SIZE_HEIGHT),
                },
                {x:0,y:0},
                {x:length % 2, y:Math.ceil(length / 2)}
            );
            if (
                newPosition.x !== positionIndex.value[id].x ||
                newPosition.y !== positionIndex.value[id].y
            ) {
                positionIndex.value = objectMove(
                    positionIndex.value,
                    positionIndex.value[id],
                    newPosition
                );
                console.log(positionIndex.value)
            }
        },
        onFinish:()=>{
            runOnJS(setMoving)(false);
            moveY.value = 0
            moveX.value = 0
            positionX.value = positionIndex.value[id].x * CONTAINER_SIZE_WIDTH;
            positionY.value = positionIndex.value[id].y * CONTAINER_SIZE_HEIGHT + 50;
        }
    })
    const rViewStyle = useAnimatedStyle(()=>{
        return {
            top: positionY.value+ moveY.value,
            left: positionX.value + moveX.value,
        };
    })

    useAnimatedReaction(
        () => positionIndex.value[id],
        (currentPosition, previousPosition) => {
            if (
                currentPosition.x !== previousPosition?.x ||
                currentPosition.y !== previousPosition?.y
            ) {
                if (!moving) {
                    positionX.value = withSpring(positionIndex.value[id].x * CONTAINER_SIZE_WIDTH);
                    positionY.value = withSpring(positionIndex.value[id].y * CONTAINER_SIZE_HEIGHT + 50);
                    moveY.value = 0;
                    moveX.value = 0;
                }
            }
        },
        [moving]
    );
    return (
        <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View style={[style, rViewStyle, { zIndex: moving?2:1}]}>
                {children}
            </Animated.View>
        </PanGestureHandler>
    );
} 

const DNDImage = (props)=>{
    const {imageProps,containerStyle,...other} = props
    return (
        <DNDContainer style={containerStyle} {...other}>
            <Animated.Image {...imageProps}  />
        </DNDContainer>
    );
}

const index = (props) => {
    // const containerPositions = useSharedValue(
    //     listToObject(images.map((item, index) => {
    //         const row = Math.floor(index / 2);
    //         const linePosition = index % 2;
    //         return {
    //             id: item.key,
    //             x: linePosition * CONTAINER_SIZE_WIDTH,
    //             y: row * CONTAINER_SIZE_HEIGHT + 50,
    //         };
    //     }))
    // );
    const positionIndex = useSharedValue(listToObjectPosition(images));
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)" }}>
            {images.map((item, index) => (
                <DNDImage
                    key={item.key}
                    id={item.key}
                    containerStyle={styles.container}
                    // positions={containerPositions}
                    positionIndex={positionIndex}
                    length={images.length}
                    imageProps={{
                        source: { uri: item.image },
                        style: styles.image,
                    }}
                />
            ))}
        </SafeAreaView>
    );
}

export default index

const styles = StyleSheet.create({
    image:{
        height:IMAGE_SIZE_HEIGHT,
        width:IMAGE_SIZE_WIDTH,
        borderRadius:10,
    },
    container:{
        width:CONTAINER_SIZE_WIDTH,
        height:CONTAINER_SIZE_HEIGHT,
        display:'flex',
        alignItems:'center',
        justifyContent:"center",
        position:"absolute"
    }
})
