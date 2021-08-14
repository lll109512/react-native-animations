import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "src/data/data.js";
import { SPACING, spec } from "./constants.js";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    interpolate,
    useAnimatedStyle,
    interpolateNode,
} from "react-native-reanimated";
import { SharedElement } from "react-navigation-shared-element";
const { ITEM_HEIGHT, ITEM_WIDTH, FULL_SIZE, RADIUS } = spec;

const AnimatedFlastList = Animated.createAnimatedComponent(FlatList);
const AnimatedText = Animated.createAnimatedComponent(Text);

const ItemCard = props => {
    const { index, item, translateX, navigation } = props;
    const inputRange = [(index - 1) * FULL_SIZE, index * FULL_SIZE, (index + 1) * FULL_SIZE];
    const animatedStyle = useAnimatedStyle(() => {
        const textTranslationX = interpolate(translateX.value, inputRange, [
            ITEM_WIDTH,
            0,
            -ITEM_HEIGHT,
        ]);
        const scale = interpolate(translateX.value, inputRange, [0.9, 1, 0.9]);
        return {
            transform: [{ translateX: textTranslationX }, { scale }],
        };
    });

    const animatedCardStyle = useAnimatedStyle(() => {
        const scale = interpolate(translateX.value, inputRange, [0.9, 1, 0.9]);
        return {
            transform: [{ scale }],
        };
    });
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.push("TravelDetail", { item });
            }}
            style={styles.itemContainer}
        >
            <Animated.View style={[styles.card, StyleSheet.absoluteFillObject, animatedCardStyle]}>
                <SharedElement
                    id={`item.${item.key}.photo`}
                    style={[StyleSheet.absoluteFillObject]}
                >
                    <Image
                        source={{ uri: item.image }}
                        style={[StyleSheet.absoluteFillObject, { resizeMode: "cover" }]}
                    />
                </SharedElement>
                <SharedElement id={`item.${item.key}.location`}>
                    <Animated.Text style={[styles.location, animatedStyle]}>
                        {item.location}
                    </Animated.Text>
                </SharedElement>
                <View style={styles.days}>
                    <Text style={styles.daysValue}>{item.numberOfDays}</Text>
                    <Text style={styles.daysLable}>days</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const TravelList = props => {
    const { navigation } = props;
    const translateX = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler({
        onScroll: ({ contentOffset: { x } }) => {
            translateX.value = x;
        },
    });
    return (
        <SafeAreaView>
            <AnimatedFlastList
                data={images}
                keyExtractor={item => `${item.key}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={FULL_SIZE}
                decelerationRate="fast"
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                    return (
                        <ItemCard
                            item={item}
                            index={index}
                            translateX={translateX}
                            navigation={navigation}
                        />
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default TravelList;

const styles = StyleSheet.create({
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        margin: SPACING,
    },
    location: {
        fontSize: 30,
        color: "white",
        fontWeight: "800",
        width: ITEM_WIDTH * 0.8,
        textTransform: "uppercase",
        position: "absolute",
        top: SPACING * 2,
        left: SPACING * 2,
    },
    days: {
        position: "absolute",
        bottom: SPACING,
        left: SPACING,
        width: 52,
        height: 52,
        borderRadius: 26,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "tomato",
    },
    daysValue: {
        fontWeight: "800",
        color: "white",
        fontSize: 16,
    },
    daysLable: {
        color: "white",
        fontSize: 16,
    },
    card: {
        borderRadius: RADIUS,
        overflow: "hidden",
    },
});
