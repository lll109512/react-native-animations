import React from 'react'
import { View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import RangeSilder from 'src/screens/Pickers/RangeSilder' 
import TimeRangePicker from 'src/screens/Pickers/TimeRangePicker' 
import Home from 'src/screens/Home' 
const Drawer = createDrawerNavigator();


const Index: React.FC = () => {
    return (
        <Drawer.Navigator initialRouteName={'Home'}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="RangeSilder" component={RangeSilder} />
            <Drawer.Screen name="TimeRangePicker" component={TimeRangePicker} />
        </Drawer.Navigator>
    )
}

export default Index
