import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View,Dimensions } from 'react-native'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { interpolate, useAnimatedProps, useAnimatedStyle } from "react-native-reanimated";
import { useTiming } from 'react-native-redash';
const {height,width} = Dimensions.get('screen')

const PRIMARY_COLOR = 'rgb(240, 88, 50)';
const SECONDARY_COLOR = 'rgb(242, 163, 44)';
const BLACK_COLOR = 'rgba(0, 0, 0,0.8)';

const Tab = createBottomTabNavigator();

const ActionsBar = (props)=>{
    const {open} = props
    const transition = useTiming(open, { duration: 400 });
    const style = useAnimatedStyle(()=>{
        const translateY = interpolate(transition.value, [0, 1],[200,0]);
        const opacity = interpolate(transition.value, [0,0.5, 1],[0,0,1]);
        return {
            transform: [{ translateY }],
            opacity: opacity,
        };
    })
    
    return (
        <Animated.View
            style={[
                {
                    position: "absolute",
                    bottom: 150,
                    backgroundColor: "white",
                    flex: 1,
                    width: "100%",
                    height: height / 2,
                    width: width - 32,
                    left: 16,
                    borderRadius: 16,
                    overflow: "hidden",
                    padding: 16,
                },
                style,
            ]}
            pointerEvents={open?'auto':'none'}
        >
            <Text
                style={{ color: BLACK_COLOR, fontSize: 28, fontWeight: "600" }}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
            >
                ADD NEW PHOTOS
            </Text>
        </Animated.View>
    );
}

const Empty = ()=>{
    return <View/>
}

const TabBarCustomButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity
            style={{ top: -35, justifyContent: "center", alignItems: "center" }}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={[PRIMARY_COLOR, SECONDARY_COLOR]}
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    borderColor: "rgb(243,242,242)",
                    // borderWidth: 4,
                }}
            >
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const index = (props) => {
    const [openActionBar, setOpenActionBar] = useState(false)
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        // elevation: 0,
                        backgroundColor: "white",
                        borderTopColor: "transparent",
                        height: 100,
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={Empty}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                    size={30}
                                    name={focused ? "home" : "home-outline"}
                                    color={focused ? PRIMARY_COLOR : BLACK_COLOR}
                                />
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Message"
                    component={Empty}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                    size={30}
                                    name={focused ? "chatbubble" : "chatbubble-outline"}
                                    color={focused ? PRIMARY_COLOR : BLACK_COLOR}
                                />
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActionBar"
                    component={Empty}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons size={50} name={"add"} color={"white"} />
                            </View>
                        ),
                        tabBarButton: props => (
                            <TabBarCustomButton
                                {...props}
                                onPress={() => {
                                    setOpenActionBar(c => !c);
                                }}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={Empty}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                    size={30}
                                    name={focused ? "aperture-sharp" : "aperture-outline"}
                                    color={focused ? PRIMARY_COLOR : BLACK_COLOR}
                                />
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="User"
                    component={Empty}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                    size={30}
                                    name={focused ? "person" : "person-outline"}
                                    color={focused ? PRIMARY_COLOR : BLACK_COLOR}
                                />
                            </View>
                        ),
                    }}
                />
            </Tab.Navigator>
            <ActionsBar open={openActionBar} />
        </View>
    );
}

export default index

const styles = StyleSheet.create({})
