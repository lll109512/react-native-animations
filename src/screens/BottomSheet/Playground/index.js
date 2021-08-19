import React, { useRef, useMemo, useCallback } from "react";
import { StyleSheet, Text, View } from 'react-native'
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetScrollView,
    BottomSheetModal,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Animated,{ interpolateColor, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const CustomBackground = ({ style, animatedIndex }) => {
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

const index = (props) => {
    // ref
    const bottomSheetRef = useRef(null)
    const animatedIndex = useSharedValue(0)

    // variables
    const snapPoints = useMemo(() => ["25%", "50%"], []);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        console.log("handleSheetChanges", index);
    }, []);

    const circleStyle = useAnimatedStyle(()=>{
        return {
            transform: [{ scale: 1 + animatedIndex.value }],
        };
    })
    const data = useMemo(
        () =>
            Array(100)
                .fill(0)
                .map((_, index) => `index-${index}`),
        []
    );
    const renderItem = useCallback(
        ({ item }) => (
            <View style={styles.itemContainer}>
                <Text>{item}</Text>
            </View>
        ),
        []
    );

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>
                <Button onPress={handlePresentModalPress} title="Present Modal" color="black" />
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >
                    <View style={styles.contentContainer}>
                        <Text>Awesome 🎉</Text>
                    </View>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
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
                // backdropComponent={BottomSheetBackdrop}
                animatedIndex={animatedIndex}
            >
                {/* <View style={styles.contentContainer}> */}
                {/* <Text>Awesome 🎉</Text> */}
                {/* <Animated.View style={[{backgroundColor:'red',height:30,width:30,borderRadius:15},circleStyle]}/> */}
                {/* <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                        {data.map(renderItem)}
                    </BottomSheetScrollView> */}
                {/* </View> */}
                <BottomSheetFlatList
                    data={data}
                    keyExtractor={i => i}
                    renderItem={renderItem}
                    contentContainerStyle={styles.contentContainer}
                />
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
});
