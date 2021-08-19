import React from 'react'
import { View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import RangeSilder from 'src/screens/Pickers/RangeSilder' 
import TimeRangePicker from 'src/screens/Pickers/TimeRangePicker' 
import SharedElementOne from 'src/screens/SharedElement/one/SharedOneRoutes' 
import SharedElementTwo from 'src/screens/SharedElement/two' 
import ParalleFlatList from 'src/screens/FlatList/ParalleFlatList' 
import SyncFlatList from 'src/screens/FlatList/SyncFlatList' 
import LongPressUnlockSlider from 'src/screens/LongPressUnlockSlider' 
import Playground from 'src/screens/BottomSheet/Playground' 
import RotaryLogin from 'src/screens/RotartLogin/index.ts' 
import Home from 'src/screens/Home' 
const Drawer = createDrawerNavigator();


const Index: React.FC = () => {
    return (
        <Drawer.Navigator initialRouteName={'Home'}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="RangeSilder" component={RangeSilder} options={{title:"Range slider"}}/>
            <Drawer.Screen name="LongPressUnlockSlider" component={LongPressUnlockSlider} options={{title:"Long press unlock slider"}}/>
            <Drawer.Screen name="TimeRangePicker" component={TimeRangePicker} />
            <Drawer.Screen name="sharedElementOne" component={SharedElementOne} options={{headerShown:false,title:"Travel list"}}/>
            <Drawer.Screen name="sharedElementTwo" component={SharedElementTwo} options={{headerShown:false,title:"Travel card"}}/>
            <Drawer.Screen name="ParalleFlatList" component={ParalleFlatList} options={{headerShown:false,title:"Paralle list"}}/>
            <Drawer.Screen name="SyncFlatList" component={SyncFlatList} options={{headerShown:false,title:"Sync list"}}/>
            <Drawer.Screen name="RotaryLogin" component={RotaryLogin} options={{headerShown:false,title:"Rotary login"}}/>
            <Drawer.Screen name="BottomsheetPlayground" component={Playground} options={{headerShown:false,title:"Bottom sheet play ground"}}/>
        </Drawer.Navigator>
    )
}

export default Index
