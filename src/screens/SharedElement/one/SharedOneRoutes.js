import React from 'react'
import { View,Easing } from 'react-native'
// import { createStackNavigator } from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import TravelList from 'src/screens/SharedElement/one/TravelList' 
import TravelDetail from 'src/screens/SharedElement/one/TravelDetail' 
const Stack = createSharedElementStackNavigator();


const Index = () => {
    const options = () => ({
      gestureEnable: false,
      // headerBackTitleVisiable:false,
      transitionSpec: {
        open: {
          animation: 'timing',
          config: {duration: 500, easing: Easing.inOut(Easing.ease)},
        },
        close: {
          animation: 'timing',
          config: {duration: 500, easing: Easing.inOut(Easing.ease)},
        },
      },
      cardStyleInterpolator: ({current: {progress}}) => {
        return {
          cardStyle: {
            opacity: progress,
          },
        };
      },
    });
    return (
        <Stack.Navigator
            initialRouteName={"TravelList"}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="TravelList" component={TravelList} />
            <Stack.Screen
                name="TravelDetail"
                component={TravelDetail}
                options={options}
                sharedElementsConfig={(route, otherRoute, showing) => {
                    const { item } = route.params;
                    return [{ id: `item.${item.key}.photo` }, { id: `item.${item.key}.location` }];
                }}
            />
        </Stack.Navigator>
    );
}

export default Index
