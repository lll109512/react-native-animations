import React, { useRef,useState, useMemo, useCallback } from "react";
import { StyleSheet, Text, View,Dimensions, FlatList } from 'react-native'
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetScrollView,
    BottomSheetModal,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated,{ Extrapolate, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import FastImage from "react-native-fast-image";
import { images } from "src/data/data";
const {width,height} = Dimensions.get('screen')

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const PADDING = 24

const CustomBackground = ({ style, animatedIndex, }) => {
    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(() => {
        console.log(animatedIndex.value)
        return {
            // @ts-ignore
            backgroundColor: interpolateColor(animatedIndex.value, [0, 1], ["#ffffff", "#a8b5eb",'red']),
        }
    });
    const containerStyle = useMemo(
        () => [style, containerAnimatedStyle],
        [style, containerAnimatedStyle]
    );
    //#endregion

    // render
    return <Animated.View pointerEvents="none" style={containerStyle} />;
};

const ImageItem = (props)=>{
    const { item, index, animatedIndex, selectedIndex } = props;
    const style = useAnimatedStyle(()=>{
        const opacity = interpolate(animatedIndex.value,[1,0.9],[1,0]);
        return {
            opacity:selectedIndex!==index ?opacity:1
        }
    })
    return (
        <Animated.View
            style={[
                {
                    width: width * 0.6,
                    height: width * 0.6,
                    marginHorizontal: PADDING,
                },
                style,
            ]}
        >
            <AnimatedFastImage
                source={{ uri: item.image }}
                style={[styles.image, StyleSheet.absoluteFillObject]}
            />
        </Animated.View>
    );
}

const index = (props) => {
    // ref
    const bottomSheetRef = useRef(null)
    const animatedIndex = useSharedValue(0)

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollEnabled, setScrollEnabled] = useState(false)
    console.log(selectedIndex);
    // variables
    const snapPoints = useMemo(() => ["14%", "60%"], []);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        console.log("handleSheetChanges", index);
        if(index===1){
            setScrollEnabled(true)
        }else{
            setScrollEnabled(false);
        }
    }, []);

    const imageStyle = useAnimatedStyle(()=>{
        const scale = interpolate(animatedIndex.value, [1, 0], [1, 0.25], Extrapolate.CLAMP);
        const left = interpolate(animatedIndex.value, [1, 0], [0, -150], Extrapolate.CLAMP);
        const top = interpolate(animatedIndex.value, [1, 0], [20, -90], Extrapolate.CLAMP);
        return {
            transform: [{ scale }],
            position:"absolute",
            left,
            top,
        };
    })

    const textsStyle = useAnimatedStyle(() => {
        const left = interpolate(animatedIndex.value, [1, 0], [width * 0.2, width * 0.6 * 0.25 + 10],Extrapolate.CLAMP);
        const top = interpolate(animatedIndex.value, [1, 0], [width * 0.7, 5], Extrapolate.CLAMP);
        // const opacity = interpolate(animatedIndex.value, [1, 0.5, 0], [1,0.2,1], Extrapolate.CLAMP);
        const scale = interpolate(animatedIndex.value, [1, 0], [1, 0.8], Extrapolate.CLAMP);
        return {
            transform: [{ scale }],
            left,
            position: "absolute",
            top,
            zIndex: -1,
        };
    });

    const subTitleStyle = useAnimatedStyle(() => {
        const left = interpolate(animatedIndex.value, [1, 0], [width * 0.25, 0],Extrapolate.CLAMP);
        return {
            left,
            marginTop:5
        };
    });

    const playStyle = useAnimatedStyle(() => {
        const opacity = interpolate(animatedIndex.value, [0.2, 0], [0, 1], Extrapolate.CLAMP);
        return {
            // left,
            opacity,
            right: 20,
            top:20,
            position:"absolute"
        };
    });

    const controlStyle = useAnimatedStyle(() => {
        const opacity = interpolate(animatedIndex.value, [1, 0.8], [1, 0.3], Extrapolate.CLAMP);
        return {
            opacity,
        };
    });
    const controlStyle2 = useAnimatedStyle(() => {
        const opacity = interpolate(animatedIndex.value, [1, 0.8], [1, 0.3], Extrapolate.CLAMP);
        return {
            opacity,
        };
    });
    const controlStyle3 = useAnimatedStyle(() => {
        const opacity = interpolate(animatedIndex.value, [1, 0.7], [1, 0], Extrapolate.CLAMP);
        return {
            opacity,
        };
    });

    return (
        <View
            style={{
                flex: 1,
                padding: 24,
                // backgroundColor: "grey",
            }}
        >
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                // backgroundComponent={CustomBackground}
                backdropComponent={BottomSheetBackdrop}
                animatedIndex={animatedIndex}
            >
                <View style={[styles.contentContainer]}>
                    <Animated.View style={[imageStyle]}>
                        <AnimatedFlatList
                            keyExtractor={item => `${item.key}`}
                            data={images}
                            onScroll={onScroll}
                            scrollEnabled={scrollEnabled}
                            horizontal
                            bounces={false}
                            onMomentumScrollEnd={e => {
                                setSelectedIndex(
                                    Math.floor(
                                        e.nativeEvent.contentOffset.x / (width * 0.6 + PADDING * 2)
                                    )
                                );
                            }}
                            // pagingEnabled
                            decelerationRate="fast"
                            snapToInterval={width * 0.6 + PADDING * 2}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: width * 0.2 - PADDING,
                                // backgroundColor:'red'
                            }}
                            renderItem={({ item, index }) => (
                                <ImageItem
                                    item={item}
                                    index={index}
                                    animatedIndex={animatedIndex}
                                    selectedIndex={selectedIndex}
                                />
                            )}
                        />
                    </Animated.View>
                    <Animated.View style={[textsStyle]}>
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={{ fontSize: 20, fontWeight: "500" }}
                        >
                            Echo of Starsong (feat.Eda)
                        </Text>
                        <Animated.View style={[subTitleStyle]}>
                            <Text
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                style={{
                                    fontSize: 18,
                                    fontWeight: "500",
                                    color: "rgba(0,0,0,0.6)",
                                }}
                            >
                                OPUS
                            </Text>
                        </Animated.View>
                    </Animated.View>
                    <Animated.View style={[styles.progressContainer, controlStyle3]}>
                        <View style={[styles.progressBar]} />
                        <View style={[styles.cursor]} />
                    </Animated.View>
                    <Animated.View style={[styles.play, controlStyle]}>
                        <AntDesign name="caretright" size={45} />
                    </Animated.View>
                    <Animated.View style={[styles.beforeAfter, controlStyle2]}>
                        <AntDesign name="stepbackward" size={45} />
                        <AntDesign name="stepforward" size={45} />
                    </Animated.View>
                    <Animated.View style={[playStyle]}>
                        <AntDesign name="caretright" size={30} />
                    </Animated.View>
                </View>
            </BottomSheet>
        </View>
    );
}

export default index

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: "center",
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: "#eee",
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "grey",
    },
    image: {
        width: width * 0.6,
        height: width * 0.6,
        position: "absolute",
        borderRadius: 15,
    },
    contentContainer: {
        position: "relative",
    },
    progressBar: {
        height: 4,
        width: width * 0.8,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 2,
    },
    progressContainer: {
        left: width * 0.1,
        top: width * 0.9,
        position:"absolute",
    },
    cursor: {
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: "rgba(0,0,0,0.9)",
        transform: [{ translateY: -12 }, { translateX: 50 }],
    },
    beforeAfter: {
        left: width * 0.1,
        top: width * 1,
        width: width * 0.8,
        display: "flex",
        alignItems: "center",
        position: "absolute",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    play: {
        left: width * 0.5 - 22.5,
        top: width * 1,
        width: width * 0.8,
        position: "absolute",
    },
});
