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
import RotaryLogin from 'src/screens/RotartLogin/index' 
import BottomTabNavigator1 from 'src/screens/BottomTabNavigator1' 
import ScrollViewAnimatedHeader from 'src/screens/FlatList/AnimatedHeader/ScrollView' 
import ScrollViewAnimatedHeaderTwo from 'src/screens/FlatList/AnimatedHeader/ScrollViewTwo' 
import DragToSort from 'src/screens/DragToSort/index.js' 
import SwipToDelete from 'src/screens/SwiperToDeleteList/index.js' 
import SwipToDeleteFlatList from 'src/screens/SwiperToDeleteList/FlatList.js' 
import hiddenActions from 'src/screens/ScrollHiddenActions/index.js' 
import Loader from 'src/screens/Loader/index.js' 
import Switch from 'src/screens/Switch/index.js' 
import FixSizeGrid from 'src/screens/DND/FixSizeGrid/index.js' 
import StockGraph from 'src/screens/SVGAnimation/stockGraph/index.js' 
import Chanel from 'src/screens/Chanel/index.js' 
import TextCounter from 'src/screens/TextAnimation/TextCounter/index.js' 
import Swiper from 'src/screens/SwiperList/index.js' 
import Home from 'src/screens/Home' 
import Form from 'src/screens/Forms/index'
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
            <Drawer.Screen name="BottomTabNavigator1" component={BottomTabNavigator1} options={{headerShown:false,title:"Bottom tab navigator 1"}}/>
            <Drawer.Screen name="ScrollViewAnimatedHeader" component={ScrollViewAnimatedHeader} options={{headerShown:false,title:"Animated header"}}/>
            <Drawer.Screen name="ScrollViewAnimatedHeaderTwo" component={ScrollViewAnimatedHeaderTwo} options={{headerShown:false,title:"Animated header two"}}/>
            <Drawer.Screen name="BottomsheetPlayground" component={Playground} options={{headerShown:false,title:"Bottom sheet play ground"}}/>
            <Drawer.Screen name="Drag to sort" component={DragToSort} options={{headerShown:false,title:"Drag to sort list"}}/>
            <Drawer.Screen name="Form test 1" component={Form} options={{headerShown:true,title:"Form test 1"}}/>
            <Drawer.Screen name="SwipToDelete" component={SwipToDelete} options={{headerShown:true,title:"swip to delete"}}/>
            <Drawer.Screen name="SwipToDeleteFlatList" component={SwipToDeleteFlatList} options={{headerShown:true,title:"swip to delete (FlatList)"}}/>
            <Drawer.Screen name="hiddenActions" component={hiddenActions} options={{headerShown:false,title:"Hidden actions"}}/>
            <Drawer.Screen name="Switch" component={Switch} options={{headerShown:false,title:"Switch"}}/>
            <Drawer.Screen name="Loader" component={Loader} options={{headerShown:false,title:"Loader"}}/>
            <Drawer.Screen name="FixSizeGrid" component={FixSizeGrid} options={{headerShown:false,title:"Fix size grid"}}/>
            <Drawer.Screen name="Chanel" component={Chanel} options={{headerShown:false,title:"Chanel Effect"}}/>
            <Drawer.Screen name="StockGraph" component={StockGraph} options={{headerShown:false,title:"Stock graph"}}/>
            <Drawer.Screen name="TextCounter" component={TextCounter} options={{headerShown:false,title:"Text counter"}}/>
            <Drawer.Screen name="Swiper" component={Swiper} options={{headerShown:true,title:"Swiper"}}/>
        </Drawer.Navigator>
    )
}

export default Index
