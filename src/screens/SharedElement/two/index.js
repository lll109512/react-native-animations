import React from "react";
import { View, Easing } from "react-native";
// import { createStackNavigator } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import CardList from "src/screens/SharedElement/two/CardList";
import CardDetail from "src/screens/SharedElement/two/CardDetail";
const Stack = createSharedElementStackNavigator();

const Index = () => {
    const options = () => ({
        gestureEnable: false,
        // headerBackTitleVisiable:false,
        transitionSpec: {
            open: {
                animation: "timing",
                config: { duration: 500, easing: Easing.inOut(Easing.ease) },
            },
            close: {
                animation: "timing",
                config: { duration: 500, easing: Easing.inOut(Easing.ease) },
            },
        },
        cardStyleInterpolator: ({ current: { progress } }) => {
            return {
                cardStyle: {
                    opacity: progress,
                },
            };
        },
    });
    return (
        <Stack.Navigator
            initialRouteName={"CardList"}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="CardList" component={CardList} />
            <Stack.Screen
                name="CardDetail"
                component={CardDetail}
                options={options}
                sharedElementsConfig={(route, otherRoute, showing) => {
                    const { item } = route.params;
                    return [{ id: `item.${item.key}.photo` }, { id: `item.${item.key}.name` }];
                }}
            />
        </Stack.Navigator>
    );
};

export default Index;
